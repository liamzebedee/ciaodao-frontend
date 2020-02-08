import React from 'react';

import { action } from '@storybook/addon-actions';
import { TheStore } from '../components/atoms/TheStore';

export default {
  title: 'TheStore',
  component: TheStore,
};

export const Basics = () => {
    return <TheStore/>
}