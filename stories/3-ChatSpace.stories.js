import React from 'react';

import { action } from '@storybook/addon-actions';
import { ChatSpace } from '../components/atoms/ChatSpace';

export default {
  title: 'ChatSpace',
  component: ChatSpace,
};

export const Test = () => {
    return <ChatSpace/>
}