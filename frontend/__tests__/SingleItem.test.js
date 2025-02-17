import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

describe('<SingleItem />', () => {
    it('renders with proper data', async () => {
        const mocks = [
            {
                request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
                result: {
                    data: {
                        item: fakeItem()
                    }
                }
            }
        ];
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123" />
            </MockedProvider>
        );

        expect(wrapper.text()).toContain('Loading...');
        // waiting 0 seconds puts next code at end of call stack
        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('h4'))).toMatchSnapshot();
        expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
        expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
    });

    it('errors with a not found item', async () => {
        const mocks = [
            {
                request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
                result: {
                    errors: [{ message: 'Item Not Found!' }]
                }
            }
        ];
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123" />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        const item = wrapper.find('[data-test="graphql-error"]');
        expect(item.text()).toContain('Item Not Found!');
        expect(toJSON(item)).toMatchSnapshot();
    });
});

// console.log(wrapper.debug());
