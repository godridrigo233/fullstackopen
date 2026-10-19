import { StyleSheet, View } from 'react-native';

import { Review } from '../types';
import { colors, spacing } from '../theme';
import AppButton from './AppButton';
import AppText from './AppText';

type ReviewItemProps = {
  review: Review;
  onViewRepository?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
};

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString();

const ReviewItem = ({
  review,
  onViewRepository,
  onDelete,
  deleting = false,
}: ReviewItemProps) => (
  <View style={styles.card} testID="review-item">
    <View style={styles.rating}>
      <AppText bold style={styles.ratingValue}>
        {review.rating}
      </AppText>
    </View>
    <View style={styles.content}>
      <AppText bold style={styles.title}>
        {review.repository.fullName}
      </AppText>
      <AppText style={styles.meta}>
        {review.user?.username ? `${review.user.username} · ` : ''}
        {formatDate(review.createdAt)}
      </AppText>
      {review.text ? <AppText style={styles.text}>{review.text}</AppText> : null}
      {onViewRepository || onDelete ? (
        <View style={styles.actions}>
          {onViewRepository ? (
            <AppButton
              onPress={onViewRepository}
              secondary
              style={styles.actionButton}
              title="View repository"
            />
          ) : null}
          {onDelete ? (
            <AppButton
              loading={deleting}
              onPress={onDelete}
              style={styles.actionButton}
              title="Delete review"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    padding: spacing.md,
  },
  rating: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 22,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 44,
  },
  ratingValue: {
    color: colors.primaryDark,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  meta: {
    color: colors.secondaryText,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    minWidth: 140,
  },
});

export default ReviewItem;
