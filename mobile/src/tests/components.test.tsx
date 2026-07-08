import React from 'react';
import { render } from '@testing-library/react-native';
import { GradientButton } from '../components/GradientButton';
import { Skeleton, SkeletonCard, LoadingScreen } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

describe('GradientButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <GradientButton title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { getByText } = render(
      <GradientButton title="Test" onPress={() => {}} icon="🚀" />
    );
    expect(getByText('🚀')).toBeTruthy();
  });
});

describe('Skeleton', () => {
  it('renders skeleton', () => {
    const { getByTestId } = render(<Skeleton testID="skeleton" />);
    expect(getByTestId('skeleton')).toBeTruthy();
  });

  it('renders loading screen', () => {
    const { getByText } = render(<LoadingScreen message="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('renders empty state', () => {
    const { getByText } = render(
      <EmptyState icon="🔍" title="No results" subtitle="Try again" />
    );
    expect(getByText('No results')).toBeTruthy();
    expect(getByText('Try again')).toBeTruthy();
  });
});
