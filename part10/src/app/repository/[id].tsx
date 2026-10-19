import { useQuery } from '@apollo/client/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import AppText from '../../components/AppText';
import RepositoryItem from '../../components/RepositoryItem';
import ReviewItem from '../../components/ReviewItem';
import Screen from '../../components/Screen';
import { useAuth } from '../../contexts/AuthContext';
import { REPOSITORY } from '../../graphql/queries';
import { Repository, Review } from '../../types';
import { colors, spacing } from '../../theme';

type RepositoryDetail = Repository & {
  reviews: {
    edges: { cursor: string; node: Review }[];
    pageInfo: { endCursor: string | null; hasNextPage: boolean };
  };
};
type RepositoryData = { repository: RepositoryDetail | null };
type RepositoryVariables = { id: string; first: number; after?: string | null };

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to open the repository.';

const RepositoryPage = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const repositoryId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { accessToken } = useAuth();
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const isFetchingMore = useRef(false);
  const { data, error, loading, fetchMore } = useQuery<
    RepositoryData,
    RepositoryVariables
  >(REPOSITORY, {
    skip: !repositoryId,
    variables: { id: repositoryId ?? '', first: 5 },
    notifyOnNetworkStatusChange: true,
  });

  const repository = data?.repository;
  const reviews = repository?.reviews.edges.map((edge) => edge.node) ?? [];

  const loadMoreReviews = () => {
    const pageInfo = repository?.reviews.pageInfo;
    if (
      isFetchingMore.current ||
      !repositoryId ||
      !pageInfo?.hasNextPage ||
      !pageInfo.endCursor
    ) {
      return;
    }
    isFetchingMore.current = true;
    setPaginationError(null);
    void fetchMore({
      variables: { after: pageInfo.endCursor },
      updateQuery: (previous, { fetchMoreResult }) => {
        if (!fetchMoreResult?.repository || !previous.repository) return previous;
        return {
          repository: {
            ...fetchMoreResult.repository,
            reviews: {
              ...fetchMoreResult.repository.reviews,
              edges: [
                ...previous.repository.reviews.edges,
                ...fetchMoreResult.repository.reviews.edges,
              ],
            },
          },
        };
      },
    }).catch((fetchError: unknown) => {
      setPaginationError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load more reviews.',
      );
    }).finally(() => {
      isFetchingMore.current = false;
    });
  };

  const openGithub = async () => {
    if (!repository?.url) return;
    try {
      await Linking.openURL(repository.url);
    } catch (openError: unknown) {
      Alert.alert('Unable to open GitHub', errorMessage(openError));
    }
  };

  const header = (
    <View>
      {repository ? (
        <>
          <RepositoryItem
            onOpenGithub={repository.url ? openGithub : undefined}
            repository={repository}
          />
          {accessToken ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const separator = repository.id.indexOf('.');
                router.push({
                  pathname: '/create-review',
                  params: {
                    ownerName: repository.id.slice(0, separator),
                    repositoryName: repository.id.slice(separator + 1),
                  },
                });
              }}
              style={styles.createReview}
            >
              <AppText bold style={styles.createReviewLabel}>
                Write a review
              </AppText>
            </Pressable>
          ) : null}
          <AppText bold style={styles.sectionTitle}>
            Reviews
          </AppText>
        </>
      ) : null}
      {loading && !repository ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : null}
      {error ? (
        <AppText accessibilityRole="alert" style={styles.error}>
          {error.message}
        </AppText>
      ) : null}
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={reviews}
        keyExtractor={(review) => review.id}
        ListFooterComponent={
          <View style={styles.footer}>
            {paginationError ? (
              <AppText accessibilityRole="alert" style={styles.error}>
                {paginationError}
              </AppText>
            ) : null}
            {repository?.reviews.pageInfo.hasNextPage ? (
              <Pressable onPress={loadMoreReviews} style={styles.loadMore}>
                <AppText bold style={styles.loadMoreLabel}>
                  Load more reviews
                </AppText>
              </Pressable>
            ) : null}
          </View>
        }
        ListHeaderComponent={header}
        onEndReached={loadMoreReviews}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <ReviewItem review={item} />}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  createReview: {
    backgroundColor: '#e5f0ed',
    padding: spacing.md,
  },
  createReviewLabel: {
    color: colors.primaryDark,
    textAlign: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  loading: {
    padding: spacing.lg,
  },
  error: {
    color: colors.error,
    padding: spacing.md,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  loadMore: {
    padding: spacing.md,
  },
  loadMoreLabel: {
    color: colors.primary,
  },
});

export default RepositoryPage;
