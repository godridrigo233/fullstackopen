import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import SignInForm, { SignInValues } from './SignInForm';

describe('SignInForm', () => {
  it('submits the entered username and password', async () => {
    const onSubmit = jest.fn<(values: SignInValues) => void>();
    const { getByTestId } = await render(
      <SignInForm onSubmit={onSubmit} />,
    );

    await fireEvent.changeText(getByTestId('username'), 'octocat');
    await fireEvent.changeText(getByTestId('password'), 'secret');
    await fireEvent.press(getByTestId('sign-in-submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({
        username: 'octocat',
        password: 'secret',
      });
    });
  });

  it('does not submit empty required fields', async () => {
    const onSubmit = jest.fn<(values: SignInValues) => void>();
    const { getByTestId, getByText } = await render(
      <SignInForm onSubmit={onSubmit} />,
    );

    await fireEvent.press(getByTestId('sign-in-submit'));

    await waitFor(() => {
      expect(getByText('Username is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
