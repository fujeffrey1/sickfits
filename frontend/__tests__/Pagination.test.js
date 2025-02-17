import { mount } from 'enzyme';
import Router from 'next/router';
import wait from 'waait';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { MockedProvider } from 'react-apollo/test-utils';

Router.router = {
    push() {},
    prefetch() {}
};

function makeMocksFor(length) {
    return [
        {
            request: { query: PAGINATION_QUERY },
            result: {
                data: {
                    itemsConnection: {
                        __typename: 'aggregate',
                        aggregate: {
                            __typename: 'count',
                            count: length
                        }
                    }
                }
            }
        }
    ];
}

describe('<Pagination />', () => {
    it('displays a loading message', () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(1)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        expect(wrapper.text()).toContain('Loading...');
    });

    it('renders pagination for 18 items', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(wrapper.find('.totalPages').text()).toEqual('5');
        // const pagination = wrapper.find('[data-test="pagination"]');
        // expect(toJSON(pagination)).toMatchSnapshot();
    });

    it('disables prev button on first page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={1} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(
            wrapper
                .find('button.MuiButtonBase-root-99')
                .at(0)
                .prop('disabled')
        ).toEqual(true);
        expect(
            wrapper
                .find('button.MuiButtonBase-root-99')
                .at(1)
                .prop('disabled')
        ).toEqual(false);
    });

    it('disables next button on last page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={5} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(
            wrapper
                .find('button.MuiButtonBase-root-99')
                .at(0)
                .prop('disabled')
        ).toEqual(false);
        expect(
            wrapper
                .find('button.MuiButtonBase-root-99')
                .at(1)
                .prop('disabled')
        ).toEqual(true);
    });

    it('enables all buttons on a middle page', async () => {
        const wrapper = mount(
            <MockedProvider mocks={makeMocksFor(18)}>
                <Pagination page={3} />
            </MockedProvider>
        );

        await wait();
        wrapper.update();
        expect(
            wrapper
                .find('button.MuiButtonBase-root-99')
                .at(0)
                .prop('disabled')
        ).toEqual(false);
        expect(
            wrapper
                .find('button.MuiButtonBase-root-99')
                .at(1)
                .prop('disabled')
        ).toEqual(false);
    });
});
