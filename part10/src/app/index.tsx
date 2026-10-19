import { useQuery } from '@apollo/client/react';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import AppText from '../components/AppText';
import RepositoryItem from '../components/RepositoryItem';
import Screen from '../components/Screen';
import { REPOSITORIES } from '../graphql/queries';
import { Repository } from '../types';
import { colors, spacing } from '../theme';

type OrderBy = 'CREATED_AT' | 'RATING_AVERAGE';
type OrderDirection = 'ASC' | 'DESC';
type OrderOption = {
  label: string;
  orderBy: OrderBy;
  orderDirection: OrderDirection;
};

const orderOptions: OrderOption[] = [
  { label: 'Latest', orderBy: 'CREATED_AT', orderDirection: 'DESC' },
  { label: 'Highest rated', orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' },
  { label: 'Lowest rated', orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' },
];

type RepositoryEdge = { cursor: string; node: Repository };
type RepositoryListData = {
  repositories: {
    edges: RepositoryEdge[];
    pageInfo: { endCursor: string | null; hasNextPage: boolean };
  };
};
type RepositoryVariables = {
  first: number;
  after?: string | null;
  orderBy: OrderBy;
  orderDirection: OrderDirection;
  searchKeyword?: string;
};

const RepositoryList = () => {
  const [searchText, setSearchText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [order, setOrder] = useState(orderOptions[0]);
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const isFetchingMore = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearchKeyword(searchText.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data, error, loading, fetchMore, refetch } = useQuery<
    RepositoryListData,
    RepositoryVariables
  >(REPOSITORIES, {
    variables: {
      first: 8,
      orderBy: order.orderBy,
      orderDirection: order.orderDirection,
      searchKeyword: searchKeyword || undefined,
    },
    notifyOnNetworkStatusChange: true,
  });

  const repositories = data?.repositories.edges.map((edge) => edge.node) ?? [];
  const pageInfo = data?.repositories.pageInfo;

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
        if (!fetchMoreResult) return previous;
        return {
          repositories: {
            ...fetchMoreResult.repositories,
            edges: [
              ...previous.repositories.edges,
              ...fetchMoreResult.repositories.edges,
            ],
          },
        };
      },
    }).catch((fetchError: unknown) => {
      setPaginationError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load more repositories.',
      );
    }).finally(() => {
      isFetchingMore.current = false;
    });
  };

  return (
    <Screen>
      <FlatList
        data={repositories}
        keyExtractor={(repository) => repository.id}
        ListEmptyComponent={
          !loading && !error ? (
            <AppText style={styles.empty}>No repositories found.</AppText>
          ) : (
            <View />
          )
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {loading ? <ActivityIndicator color={colors.primary} /> : null}
            {paginationError ? (
              <AppText accessibilityRole="alert" style={styles.error}>
                {paginationError}
              </AppText>
            ) : null}
            {error ? (
              <View style={styles.errorBox}>
                <AppText accessibilityRole="alert" style={styles.error}>
                  {error.message}
                </AppText>
                <Pressable onPress={() => void refetch()}>
                  <AppText bold style={styles.retry}>
                    Retry
                  </AppText>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        ListHeaderComponent={
          <View style={styles.controls}>
            <TextInput
              accessibilityLabel="Search repositories"
              onChangeText={setSearchText}
              placeholder="Search repositories"
              style={styles.search}
              testID="repository-search"
              value={searchText}
            />
            <View style={styles.orderRow}>
              {orderOptions.map((option) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: order.label === option.label }}
                  key={option.label}
                  onPress={() => setOrder(option)}
                  style={[
                    styles.orderOption,
                    order.label === option.label && styles.selectedOrder,
                  ]}
                >
                  <AppText
                    style={[
                      styles.orderLabel,
                      order.label === option.label && styles.selectedOrderLabel,
                    ]}
                  >
                    {option.label}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <RepositoryItem
            onPress={() =>
              router.push({
                pathname: '/repository/[id]',
                params: { id: item.id },
              })
            }
            repository={item}
          />
        )}
        testID="repository-list"
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  controls: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  orderOption: {
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedOrder: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  orderLabel: {
    color: colors.secondaryText,
    fontSize: 13,
  },
  selectedOrderLabel: {
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
    minHeight: 56,
    padding: spacing.md,
  },
  empty: {
    color: colors.secondaryText,
    padding: spacing.lg,
    textAlign: 'center',
  },
  errorBox: {
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    textAlign: 'center',
  },
  retry: {
    color: colors.primary,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
});

export default RepositoryList;
