import { useMutation, useQuery } from '@apollo/client/react';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

import AppText from '../components/AppText';
import ReviewItem from '../components/ReviewItem';
import Screen from '../components/Screen';
import { useAuth } from '../contexts/AuthContext';
import { DELETE_REVIEW } from '../graphql/mutations';
import { ME } from '../graphql/queries';
import { Review } from '../types';
import { colors, spacing } from '../theme';

type MeData = {
  me: {
    id: string;
    username: string;
    reviews: {
      edges: { cursor: string; node: Review }[];
      pageInfo: { endCursor: string | null; hasNextPage: boolean };
    };
  } | null;
};
type MeVariables = { first: number; after?: string | null };

const MyReviews = () => {
  const { accessToken, isLoading } = useAuth();
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isFetchingMore = useRef(false);
  const { data, error, loading, fetchMore } = useQuery<MeData, MeVariables>(
    ME,
    {
      skip: !accessToken,
      variables: { first: 8 },
      notifyOnNetworkStatusChange: true,
    },
  );
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    update(cache, _result, { variables }) {
      const reviewId = variables?.id;
      if (typeof reviewId !== 'string') return;
      const cached = cache.readQuery<MeData, MeVariables>({
        query: ME,
        variables: { first: 8 },
      });
      if (!cached?.me) return;
      cache.writeQuery<MeData, MeVariables>({
        query: ME,
        variables: { first: 8 },
        data: {
          me: {
            ...cached.me,
            reviews: {
              ...cached.me.reviews,
              edges: cached.me.reviews.edges.filter(
                ({ node }) => node.id !== reviewId,
              ),
            },
          },
        },
      });
    },
  });

  useEffect(() => {
    if (!isLoading && !accessToken) router.replace('/sign-in');
  }, [accessToken, isLoading]);

  const reviews = data?.me?.reviews.edges.map((edge) => edge.node) ?? [];
  const pageInfo = data?.me?.reviews.pageInfo;

  const loadMore = () => {
    if (
      isFetchingMore.current ||
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
        if (!fetchMoreResult?.me || !previous.me) return previous;
        return {
          me: {
            ...fetchMoreResult.me,
            reviews: {
              ...fetchMoreResult.me.reviews,
              edges: [
                ...previous.me.reviews.edges,
                ...fetchMoreResult.me.reviews.edges,
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

  const removeReview = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteReview({ variables: { id } });
    } catch (deleteError: unknown) {
      Alert.alert(
        'Unable to delete review',
        deleteError instanceof Error ? deleteError.message : 'Please try again.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete review?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => void removeReview(id),
      },
    ]);
  };

  if (isLoading || loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={reviews}
        keyExtractor={(review) => review.id}
        ListEmptyComponent={
          !error ? (
            <AppText style={styles.empty}>You have not written any reviews yet.</AppText>
          ) : (
            <View />
          )
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {paginationError ? (
              <AppText accessibilityRole="alert" style={styles.error}>
                {paginationError}
              </AppText>
            ) : null}
            {error ? (
              <AppText accessibilityRole="alert" style={styles.error}>
                {error.message}
              </AppText>
            ) : null}
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <ReviewItem
            deleting={deletingId === item.id}
            onDelete={() => confirmDelete(item.id)}
            onViewRepository={() =>
              router.push({
                pathname: '/repository/[id]',
                params: { id: item.repository.id },
              })
            }
            review={item}
          />
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
  },
  empty: {
    color: colors.secondaryText,
    padding: spacing.lg,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  error: {
    color: colors.error,
    textAlign: 'center',
  },
});

export default MyReviews;
