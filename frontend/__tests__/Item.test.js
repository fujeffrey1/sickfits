import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: 'ABC123',
    title: 'A Cool Item',
    price: 4000,
    description: 'This item is really cool!',
    image: 'dog.jpg',
    largeImage: 'largedog.jpg'
};

// describe('<Item />', () => {
//     it('renders and displays properly', () => {
//         const wrapper = shallow(<ItemComponent item={fakeItem} />);
//         const PriceTag = wrapper.dive().find('.Item-price-3');
//         const Title = wrapper
//             .dive()
//             .find('.Item-color-4')
//             .at(1);
//         console.log(wrapper.dive().debug());
//         expect(PriceTag.children().text()).toBe('$50');
//         expect(Title.children().text()).toBe(fakeItem.title);
//     });
// });

describe('<Item />', () => {
    it('renders and matches the snapshot', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        expect(toJSON(wrapper.dive())).toMatchSnapshot();
    });
});
