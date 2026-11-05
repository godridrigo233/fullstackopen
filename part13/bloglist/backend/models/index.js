const Blog = require('./blog')
const ReadingList = require('./readingList')
const Session = require('./session')
const User = require('./user')

User.hasMany(Blog, { as: 'blogs', foreignKey: 'userId' })
Blog.belongsTo(User, { as: 'user', foreignKey: 'userId' })
User.hasMany(ReadingList, { as: 'readinglists', foreignKey: 'userId' })
ReadingList.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Blog.hasMany(ReadingList, { as: 'readinglists', foreignKey: 'blogId' })
ReadingList.belongsTo(Blog, { as: 'blog', foreignKey: 'blogId' })
User.belongsToMany(Blog, {
  as: 'readings', through: ReadingList, foreignKey: 'userId', otherKey: 'blogId',
})
Blog.belongsToMany(User, {
  as: 'readers', through: ReadingList, foreignKey: 'blogId', otherKey: 'userId',
})
User.hasMany(Session, { as: 'sessions', foreignKey: 'userId' })
Session.belongsTo(User, { as: 'user', foreignKey: 'userId' })

module.exports = { Blog, ReadingList, Session, User }