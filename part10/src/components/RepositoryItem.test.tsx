import { render, within } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';

import RepositoryItem, { formatCount } from './RepositoryItem';
import { Repository } from '../types';

const repository: Repository = {
  id: 'jaredpalmer.formik',
  fullName: 'jaredpalmer/formik',
  description: 'Build forms in React, without the tears.',
  language: 'TypeScript',
  forksCount: 2500,
  stargazersCount: 1234,
  ratingAverage: 88,
  reviewCount: 12,
  ownerAvatarUrl: 'https://example.com/avatar.png',
  url: 'https://github.com/jaredpalmer/formik',
};

describe('RepositoryItem', () => {
  it('abbreviates counts starting at one thousand', () => {
    expect(formatCount(999)).toBe('999');
    expect(formatCount(1000)).toBe('1.0k');
    expect(formatCount(1500)).toBe('1.5k');
  });

  it('renders repository details and formatted statistics', async () => {
    const { getByTestId, getByText } = await render(
      <RepositoryItem repository={repository} />,
    );

    expect(getByTestId('repository-full-name')).toHaveTextContent(
      'jaredpalmer/formik',
    );
    expect(getByTestId('repository-description')).toHaveTextContent(
      'Build forms in React, without the tears.',
    );
    expect(getByTestId('repository-language')).toHaveTextContent('TypeScript');
    expect(within(getByTestId('repository-stars')).getByText('1.2k')).toBeTruthy();
    expect(within(getByTestId('repository-forks')).getByText('2.5k')).toBeTruthy();
    expect(within(getByTestId('repository-rating')).getByText('88')).toBeTruthy();
    expect(within(getByTestId('repository-reviews')).getByText('12')).toBeTruthy();
    expect(getByText('Stars')).toBeTruthy();
    expect(getByText('Forks')).toBeTruthy();
    expect(getByText('Rating')).toBeTruthy();
    expect(getByText('Reviews')).toBeTruthy();
  });
});
