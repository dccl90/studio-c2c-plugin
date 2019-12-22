import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import registerCustomActions from './Actions';


const PLUGIN_NAME = 'C2CPlugin';
const runtimeDomain = 'crimson-octopus-2455.twil.io';
export default class C2CPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    registerCustomActions(runtimeDomain, manager);
  }
}
