describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // Creamos un usuario principal para las pruebas
    const user = {
      name: 'Rodrigo Gomez',
      username: 'rodrigo',
      password: 'secreto123'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    const secondUser = {
      name: 'Usuario Secundario',
      username: 'secundario',
      password: 'secreto123'
    }
    cy.request('POST', 'http://localhost:3003/api/users', secondUser)

    // Entramos a la aplicación de frontend
    cy.visit('http://localhost:5173')
  })

  it('5.18: Login form is shown by default', () => {
    cy.contains('Log in to application')
    cy.get('input[name="Username"]').should('be.visible')
    cy.get('input[name="Password"]').should('be.visible')
    cy.get('button[type="submit"]').contains('login').should('be.visible')
  })

  describe('5.19: Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('input[name="Username"]').type('rodrigo')
      cy.get('input[name="Password"]').type('secreto123')
      cy.get('button[type="submit"]').click()

      cy.contains('Rodrigo Gomez logged in')
    })

    it('fails with wrong credentials and shows error styling', () => {
      cy.get('input[name="Username"]').type('rodrigo')
      cy.get('input[name="Password"]').type('claveincorrecta')
      cy.get('button[type="submit"]').click()

      // Validamos que aparezca el mensaje y que tenga el estilo en color rojo (rgb(255, 0, 0))
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      
      cy.contains('Rodrigo Gomez logged in').should('not.exist')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      // Iniciamos sesión mediante la interfaz visual antes de cada prueba de este bloque
      cy.get('input[name="Username"]').type('rodrigo')
      cy.get('input[name="Password"]').type('secreto123')
      cy.get('button[type="submit"]').click()
      cy.contains('Rodrigo Gomez logged in')
    })

    it('5.20: A new blog can be created', () => {
      cy.contains('new blog').click()
      cy.get('input[name="Title"]').type('Probando Cypress E2E')
      cy.get('input[name="Author"]').type('Rodrigo Gomez')
      cy.get('input[name="Url"]').type('https://cypress.io')
      cy.get('button').contains('create').click()

      cy.contains('a new blog Probando Cypress E2E by Rodrigo Gomez added')
      cy.contains('Probando Cypress E2E Rodrigo Gomez')
    })

    describe('And a blog exists', () => {
      beforeEach(() => {
        // Creamos un blog para probar sus interacciones
        cy.contains('new blog').click()
        cy.get('input[name="Title"]').type('Blog para interactuar')
        cy.get('input[name="Author"]').type('Rodrigo Gomez')
        cy.get('input[name="Url"]').type('https://test.com')
        cy.get('button').contains('create').click()
        cy.contains('Blog para interactuar Rodrigo Gomez')
      })

      it('5.21: A blog can be liked', () => {
        cy.contains('Blog para interactuar').parent().find('button').contains('view').click()
        cy.contains('likes 0')
        
        cy.contains('button', 'like').click()
        cy.contains('likes 1')
      })

      it('5.22: The creator can delete the blog', () => {
        cy.contains('Blog para interactuar').parent().find('button').contains('view').click()
        
        // Cypress acepta automáticamente los diálogos de window.confirm por defecto
        cy.contains('button', 'remove').click()
        
        cy.contains('Blog para interactuar').should('not.exist')
      })

      it('5.22: Only the creator can see the remove button', () => {
        // Cerramos sesión del usuario Rodrigo
        cy.contains('button', 'logout').click()

        // Iniciamos sesión como el 'Usuario Secundario' (que no es dueño del blog)
        cy.get('input[name="Username"]').type('secundario')
        cy.get('input[name="Password"]').type('secreto123')
        cy.get('button[type="submit"]').click()
        cy.contains('Usuario Secundario logged in')

        // Desplegamos la tarjeta del blog
        cy.contains('Blog para interactuar').parent().find('button').contains('view').click()

        // Verificamos que el botón de eliminar no exista o no sea visible
        cy.contains('button', 'remove').should('not.exist')
      })
    })

    describe('5.23: Ordering blogs by likes', () => {
      it('blogs are ordered according to likes with the most liked blog first', () => {
        // Función auxiliar para crear blogs dentro de la prueba
        const createBlog = (title, author, url) => {
          cy.contains('new blog').click()
          cy.get('input[name="Title"]').type(title)
          cy.get('input[name="Author"]').type(author)
          cy.get('input[name="Url"]').type(url)
          cy.get('button').contains('create').click()
          cy.contains(`${title} ${author}`)
        }

        createBlog('Blog con 1 like', 'Autor A', 'http://url1.com')
        createBlog('Blog con 3 likes', 'Autor B', 'http://url2.com')
        createBlog('Blog con 2 likes', 'Autor C', 'http://url3.com')

        // Expandimos todos los blogs para poder hacer clic en "like"
        cy.get('.blog').find('button').contains('view').click({ multiple: true })

        // Damos likes de forma selectiva esperando la actualización del contador
        cy.contains('Blog con 3 likes').parent().as('blog3')
        cy.get('@blog3').contains('button', 'like').click()
        cy.get('@blog3').contains('likes 1')
        cy.get('@blog3').contains('button', 'like').click()
        cy.get('@blog3').contains('likes 2')
        cy.get('@blog3').contains('button', 'like').click()
        cy.get('@blog3').contains('likes 3')

        cy.contains('Blog con 2 likes').parent().as('blog2')
        cy.get('@blog2').contains('button', 'like').click()
        cy.get('@blog2').contains('likes 1')
        cy.get('@blog2').contains('button', 'like').click()
        cy.get('@blog2').contains('likes 2')

        cy.contains('Blog con 1 like').parent().as('blog1')
        cy.get('@blog1').contains('button', 'like').click()
        cy.get('@blog1').contains('likes 1')

        // Validamos el orden exacto de las tarjetas en el DOM basándonos en el texto
        cy.get('.blog').eq(0).should('contain', 'Blog con 3 likes')
        cy.get('.blog').eq(1).should('contain', 'Blog con 2 likes')
        cy.get('.blog').eq(2).should('contain', 'Blog con 1 like')
      })
    })
  })
})