import { useMutation } from '@apollo/client/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AppText from '../components/AppText';
import ReviewForm, { ReviewValues } from '../components/ReviewForm';
import Screen from '../components/Screen';
import { useAuth } from '../contexts/AuthContext';
import { apolloClient } from '../graphql/client';
import { CREATE_REVIEW } from '../graphql/mutations';
import { colors, spacing } from '../theme';

type CreateReviewData = {
  createReview: { id: string; rating: number; text: string | null };
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to create the review.';

const CreateReview = () => {
  const { accessToken, isLoading } = useAuth();
  const params = useLocalSearchParams<{
    ownerName?: string;
    repositoryName?: string;
  }>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [createReview, { loading }] =
    useMutation<CreateReviewData>(CREATE_REVIEW);

  useEffect(() => {
    if (!isLoading && !accessToken) router.replace('/sign-in');
  }, [accessToken, isLoading]);

  const onSubmit = async (values: ReviewValues) => {
    setServerError(null);
    const ownerName = values.ownerName.trim().toLowerCase();
    const repositoryName = values.repositoryName.trim().toLowerCase();
    try {
      await createReview({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(values.rating),
            text: values.text.trim() || undefined,
          },
        },
      });
      const id = `${ownerName}.${repositoryName}`;
      apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'repositories' });
      apolloClient.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'repository',
        args: { id },
      });
      apolloClient.cache.gc();
      router.replace({ pathname: '/repository/[id]', params: { id } });
    } catch (error: unknown) {
      setServerError(errorMessage(error));
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <AppText bold style={styles.title}>
            Create a repository review
          </AppText>
          <ReviewForm
            initialValues={{
              ownerName: params.ownerName,
              repositoryName: params.repositoryName,
            }}
            loading={loading}
            onSubmit={onSubmit}
            serverError={serverError}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  title: {
    color: colors.primaryDark,
    fontSize: 24,
    marginBottom: spacing.md,
  },
});

export default CreateReview;
