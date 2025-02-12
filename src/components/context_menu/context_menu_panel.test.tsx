/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { render, mount } from 'enzyme';
import { findTestSubject, requiredProps } from '../../test';

import { EuiContextMenuPanel, SIZES } from './context_menu_panel';

import { EuiContextMenuItem } from './context_menu_item';

import { tick } from './context_menu.test';

import { keys } from '../../services';

const items = [
  <EuiContextMenuItem key="A" data-test-subj="itemA">
    Option A
  </EuiContextMenuItem>,
  <EuiContextMenuItem key="B" data-test-subj="itemB">
    Option B
  </EuiContextMenuItem>,
  <EuiContextMenuItem key="C" data-test-subj="itemC">
    Option C
  </EuiContextMenuItem>,
];

describe('EuiContextMenuPanel', () => {
  test('is rendered', () => {
    const component = render(
      <EuiContextMenuPanel {...requiredProps}>Hello</EuiContextMenuPanel>
    );

    expect(component).toMatchSnapshot();
  });

  describe('props', () => {
    describe('title', () => {
      test('is rendered', () => {
        const component = render(<EuiContextMenuPanel title="Title" />);

        expect(component).toMatchSnapshot();
      });
    });

    describe('size', () => {
      SIZES.forEach((size) => {
        it(`${size} is rendered`, () => {
          const component = render(
            <EuiContextMenuPanel title="Title" size={size} />
          );

          expect(component).toMatchSnapshot();
        });
      });
    });

    describe('onClose', () => {
      test('renders a button as a title', () => {
        const component = render(
          <EuiContextMenuPanel title="Title" onClose={() => {}} />
        );

        expect(component).toMatchSnapshot();
      });

      test("isn't called upon instantiation", () => {
        const onCloseHandler = jest.fn();

        mount(<EuiContextMenuPanel title="Title" onClose={onCloseHandler} />);

        expect(onCloseHandler).not.toHaveBeenCalled();
      });

      test('is called when the title is clicked', () => {
        const onCloseHandler = jest.fn();

        const component = mount(
          <EuiContextMenuPanel title="Title" onClose={onCloseHandler} />
        );

        component.find('button').simulate('click');

        expect(onCloseHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('onHeightChange', () => {
      it('is called with a height value', () => {
        const onHeightChange = jest.fn();

        mount(<EuiContextMenuPanel onHeightChange={onHeightChange} />);

        expect(onHeightChange).toHaveBeenCalledWith(0);
      });
    });

    describe('transitionDirection', () => {
      describe('next', () => {
        describe('with transitionType', () => {
          describe('in', () => {
            test('is rendered', () => {
              const component = render(
                <EuiContextMenuPanel
                  transitionDirection="next"
                  transitionType="in"
                />
              );

              expect(component).toMatchSnapshot();
            });
          });

          describe('out', () => {
            test('is rendered', () => {
              const component = render(
                <EuiContextMenuPanel
                  transitionDirection="next"
                  transitionType="out"
                />
              );

              expect(component).toMatchSnapshot();
            });
          });
        });
      });

      describe('previous', () => {
        describe('with transitionType', () => {
          describe('in', () => {
            test('is rendered', () => {
              const component = render(
                <EuiContextMenuPanel
                  transitionDirection="previous"
                  transitionType="in"
                />
              );

              expect(component).toMatchSnapshot();
            });
          });

          describe('out', () => {
            test('is rendered', () => {
              const component = render(
                <EuiContextMenuPanel
                  transitionDirection="previous"
                  transitionType="out"
                />
              );

              expect(component).toMatchSnapshot();
            });
          });
        });
      });
    });

    describe('initialFocusedItemIndex', () => {
      // Reset focus between tests
      beforeEach(() => (document.activeElement as HTMLElement)?.blur());

      it('sets focus on the item occupying that index', async () => {
        const component = mount(
          <EuiContextMenuPanel items={items} initialFocusedItemIndex={1} />
        );

        await tick(20);

        expect(document.activeElement).toBe(
          findTestSubject(component, 'itemB').getDOMNode()
        );
      });
    });

    describe('onUseKeyboardToNavigate', () => {
      it('is called when up arrow is pressed', () => {
        const onUseKeyboardToNavigateHandler = jest.fn();

        const component = mount(
          <EuiContextMenuPanel
            items={items}
            onUseKeyboardToNavigate={onUseKeyboardToNavigateHandler}
          />
        );

        component.simulate('keydown', { key: keys.ARROW_UP });
        expect(onUseKeyboardToNavigateHandler).toHaveBeenCalledTimes(1);
      });

      it('is called when down arrow is pressed', () => {
        const onUseKeyboardToNavigateHandler = jest.fn();

        const component = mount(
          <EuiContextMenuPanel
            items={items}
            onUseKeyboardToNavigate={onUseKeyboardToNavigateHandler}
          />
        );

        component.simulate('keydown', { key: keys.ARROW_UP });
        expect(onUseKeyboardToNavigateHandler).toHaveBeenCalledTimes(1);
      });

      describe('left arrow', () => {
        it('calls handler if onClose and showPreviousPanel exists', () => {
          const onUseKeyboardToNavigateHandler = jest.fn();

          const component = mount(
            <EuiContextMenuPanel
              items={items}
              onClose={() => {}}
              showPreviousPanel={() => {}}
              onUseKeyboardToNavigate={onUseKeyboardToNavigateHandler}
            />
          );

          component.simulate('keydown', { key: keys.ARROW_LEFT });
          expect(onUseKeyboardToNavigateHandler).toHaveBeenCalledTimes(1);
        });

        it("doesn't call handler if showPreviousPanel doesn't exist", () => {
          const onUseKeyboardToNavigateHandler = jest.fn();

          const component = mount(
            <EuiContextMenuPanel
              items={items}
              onUseKeyboardToNavigate={onUseKeyboardToNavigateHandler}
            />
          );

          component.simulate('keydown', { key: keys.ARROW_LEFT });
          expect(onUseKeyboardToNavigateHandler).not.toHaveBeenCalled();
        });
      });

      describe('right arrow', () => {
        it('calls handler if showNextPanel exists', () => {
          const onUseKeyboardToNavigateHandler = jest.fn();

          const component = mount(
            <EuiContextMenuPanel
              items={items}
              showNextPanel={() => {}}
              onUseKeyboardToNavigate={onUseKeyboardToNavigateHandler}
            />
          );

          component.simulate('keydown', { key: keys.ARROW_RIGHT });
          expect(onUseKeyboardToNavigateHandler).toHaveBeenCalledTimes(1);
        });

        it("doesn't call handler if showNextPanel doesn't exist", () => {
          const onUseKeyboardToNavigateHandler = jest.fn();

          const component = mount(
            <EuiContextMenuPanel
              items={items}
              onUseKeyboardToNavigate={onUseKeyboardToNavigateHandler}
            />
          );

          component.simulate('keydown', { key: keys.ARROW_RIGHT });
          expect(onUseKeyboardToNavigateHandler).not.toHaveBeenCalled();
        });
      });
    });
  });

  // @see Cypress context_menu_panel.spec.tsx for focus & keyboard nav testing

  describe('updating items and content', () => {
    describe('updates to items', () => {
      it("should not re-render if any items's watchedItemProps did not change", () => {
        expect.assertions(2); // make sure the assertion in the `setProps` callback is executed

        // by not passing `watchedItemProps` no changes to items should cause a re-render
        const component = mount(
          <EuiContextMenuPanel
            items={[
              <EuiContextMenuItem key="A" data-counter={0}>
                Option A
              </EuiContextMenuItem>,
              <EuiContextMenuItem key="B" data-counter={1}>
                Option B
              </EuiContextMenuItem>,
            ]}
          />
        );

        expect(component.debug()).toMatchSnapshot();

        component.setProps(
          {
            items: [
              <EuiContextMenuItem key="A" data-counter={2}>
                Option A
              </EuiContextMenuItem>,
              <EuiContextMenuItem key="B" data-counter={3}>
                Option B
              </EuiContextMenuItem>,
            ],
          },
          () => {
            expect(component.debug()).toMatchSnapshot();
          }
        );
      });

      it("should re-render if any items's watchedItemProps did change", () => {
        expect.assertions(2); // make sure the assertion in the `setProps` callback is executed

        // by referencing the `data-counter` property in `watchedItemProps`
        // changes to the items should be picked up and re-rendered
        const component = mount(
          <EuiContextMenuPanel
            watchedItemProps={['data-counter']}
            items={[
              <EuiContextMenuItem key="A" data-counter={0}>
                Option A
              </EuiContextMenuItem>,
              <EuiContextMenuItem key="B" data-counter={1}>
                Option B
              </EuiContextMenuItem>,
            ]}
          />
        );

        expect(component.debug()).toMatchSnapshot();

        component.setProps(
          {
            items: [
              <EuiContextMenuItem key="A" data-counter={2}>
                Option A
              </EuiContextMenuItem>,
              <EuiContextMenuItem key="B" data-counter={3}>
                Option B
              </EuiContextMenuItem>,
            ],
          },
          () => {
            expect(component.debug()).toMatchSnapshot();
          }
        );
      });

      it('should re-render at all times when children exists', () => {
        expect.assertions(2); // make sure the assertion in the `setProps` callback is executed

        const component = mount(
          <EuiContextMenuPanel>Hello World</EuiContextMenuPanel>
        );

        expect(component.debug()).toMatchSnapshot();

        component.setProps({ children: 'More Salutations' }, () => {
          expect(component.debug()).toMatchSnapshot();
        });
      });
    });
  });
});
