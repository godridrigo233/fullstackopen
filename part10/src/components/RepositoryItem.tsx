import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Repository } from '../types';
import { colors, spacing } from '../theme';
import AppButton from './AppButton';
import AppText from './AppText';

export const formatCount = (count: number | null): string => {
  if (count === null) return '0';
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
};

type RepositoryItemProps = {
  repository: Repository;
  onPress?: () => void;
  onOpenGithub?: () => void;
};

const RepositoryItem = ({
  repository,
  onPress,
  onOpenGithub,
}: RepositoryItemProps) => {
  const content = (
    <>
      <View style={styles.header}>
        {repository.ownerAvatarUrl ? (
          <Image
            accessibilityLabel="Repository owner avatar"
            source={{ uri: repository.ownerAvatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
        <View style={styles.titleContainer}>
          <AppText bold style={styles.name} testID="repository-full-name">
            {repository.fullName}
          </AppText>
          {repository.description ? (
            <AppText
              numberOfLines={3}
              style={styles.description}
              testID="repository-description"
            >
              {repository.description}
            </AppText>
          ) : null}
          {repository.language ? (
            <AppText style={styles.language} testID="repository-language">
              {repository.language}
            </AppText>
          ) : null}
        </View>
      </View>
      <View style={styles.stats}>
        <Stat label="Stars" testID="repository-stars">
          {formatCount(repository.stargazersCount)}
        </Stat>
        <Stat label="Forks" testID="repository-forks">
          {formatCount(repository.forksCount)}
        </Stat>
        <Stat label="Rating" testID="repository-rating">
          {repository.ratingAverage}
        </Stat>
        <Stat label="Reviews" testID="repository-reviews">
          {repository.reviewCount}
        </Stat>
      </View>
      {onOpenGithub ? (
        <AppButton
          onPress={onOpenGithub}
          style={styles.githubButton}
          testID="open-github"
          title="Open in GitHub"
        />
      ) : null}
    </>
  );

  return onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.card}
      testID="repository-item"
    >
      {content}
    </Pressable>
  ) : (
    <View style={styles.card} testID="repository-item">
      {content}
    </View>
  );
};

type StatProps = {
  children: React.ReactNode;
  label: string;
  testID: string;
};

const Stat = ({ children, label, testID }: StatProps) => (
  <View style={styles.stat} testID={testID}>
    <AppText bold style={styles.statValue}>
      {children}
    </AppText>
    <AppText style={styles.statLabel}>{label}</AppText>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  avatar: {
    borderRadius: 8,
    height: 52,
    marginRight: spacing.md,
    width: 52,
  },
  avatarPlaceholder: {
    backgroundColor: '#dce6e2',
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    color: colors.primaryDark,
    fontSize: 17,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  language: {
    color: colors.secondaryText,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  stat: {
    alignItems: 'center',
    minWidth: 58,
  },
  statValue: {
    color: colors.text,
    fontSize: 15,
  },
  statLabel: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  githubButton: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
});

export default RepositoryItem;
