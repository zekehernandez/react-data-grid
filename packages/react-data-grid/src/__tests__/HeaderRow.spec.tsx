import React from 'react';
import { shallow } from 'enzyme';

import helpers from '../helpers/test/GridPropHelpers';
import HeaderRow, { HeaderRowProps } from '../HeaderRow';
import HeaderCell from '../HeaderCell';
import SortableHeaderCell from '../common/cells/headerCells/SortableHeaderCell';
import FilterableHeaderCell from '../common/cells/headerCells/FilterableHeaderCell';
import { HeaderRowType, DEFINE_SORT } from '../common/enums';

describe('Header Row Unit Tests', () => {
  const defaultProps = {
    rowType: HeaderRowType.HEADER,
    columns: helpers.columns,
    onColumnResize() {},
    onColumnResizeEnd() {},
    onSort: jest.fn(),
    sortDirection: DEFINE_SORT.NONE,
    height: 35,
    onFilterChange() {},
    onHeaderDrop() {},
    draggableHeaderCell: () => <div />
  };

  const setup = (testProps?: Partial<HeaderRowProps>) => {
    const props: HeaderRowProps = { ...defaultProps, ...testProps };
    const wrapper = shallow(<HeaderRow {...props} />);
    const headerCells = wrapper.find(HeaderCell);
    return { wrapper, headerCells, props };
  };

  describe('When column is sortable and headerCellRenderer not provided', () => {
    const sortableColIdx = 1;

    beforeEach(() => {
      defaultProps.columns[sortableColIdx].sortable = true;
    });

    afterEach(() => {
      defaultProps.columns[sortableColIdx].sortable = false;
    });

    it('should provide column with a sortableHeaderRenderer', () => {
      const { headerCells } = setup({ sortColumn: defaultProps.columns[sortableColIdx].key });
      const renderer = headerCells.at(sortableColIdx).props().renderer as React.ReactElement;
      expect(renderer.type).toBe(SortableHeaderCell);
    });

    it('should pass sort direction as props to headerRenderer when column is sortColumn', () => {
      const { headerCells } = setup({ sortColumn: defaultProps.columns[sortableColIdx].key, sortDirection: DEFINE_SORT.ASC });
      const renderer = headerCells.at(sortableColIdx).props().renderer as React.ReactElement;
      expect(renderer.props.sortDirection).toEqual('ASC');
    });

    it('should call onSort when headerRender triggers sort', () => {
      const { headerCells, props } = setup({ sortColumn: defaultProps.columns[sortableColIdx].key, sortDirection: DEFINE_SORT.ASC });
      const renderer = headerCells.at(sortableColIdx).props().renderer as React.ReactElement;
      renderer.props.onSort('title', 'DESC');
      expect(props.onSort).toHaveBeenCalled();
      expect(props.onSort).toHaveBeenCalledWith('title', 'DESC');
    });
  });

  describe('When column is sortable and filterable', () => {
    const sortableAndFilterableColIdx = 1;

    describe('When row is filterable', () => {
      beforeEach(() => {
        defaultProps.columns[sortableAndFilterableColIdx].sortable = true;
        defaultProps.columns[sortableAndFilterableColIdx].filterable = true;
      });

      it('should provide column with a filterableHeaderRenderer', () => {
        const { headerCells } = setup({ sortColumn: defaultProps.columns[sortableAndFilterableColIdx].key, filterable: true });
        const renderer = headerCells.at(sortableAndFilterableColIdx).props().renderer as React.ReactElement;
        expect(renderer.type).toBe(FilterableHeaderCell);
      });
    });

    describe('When row is not filterable', () => {
      beforeEach(() => {
        defaultProps.columns[sortableAndFilterableColIdx].sortable = true;
        defaultProps.columns[sortableAndFilterableColIdx].filterable = true;
      });

      it('should provide column with a sortableHeaderRenderer', () => {
        const { headerCells } = setup({ sortColumn: defaultProps.columns[sortableAndFilterableColIdx].key });
        const renderer = headerCells.at(sortableAndFilterableColIdx).props().renderer as React.ReactElement;
        expect(renderer.type).toBe(SortableHeaderCell);
      });
    });

    afterEach(() => {
      defaultProps.columns[sortableAndFilterableColIdx].sortable = false;
      defaultProps.columns[sortableAndFilterableColIdx].filterable = false;
    });
  });

  describe('When column has a headerRenderer', () => {
    const CustomHeader = () => <div>Custom</div>;
    const customColumnIdx = 1;
    beforeEach(() => {
      defaultProps.columns[customColumnIdx].headerRenderer = <CustomHeader />;
    });

    it('should render custom column header', () => {
      const { headerCells } = setup();
      const renderer = headerCells.at(customColumnIdx).props().renderer as React.ReactElement;
      expect(renderer.type).toBe(CustomHeader);
    });

    it('should render filter if header row if row and column is filterable', () => {
      defaultProps.columns[customColumnIdx].filterable = true;
      const { headerCells } = setup({ filterable: true });
      const renderer = headerCells.at(customColumnIdx).props().renderer as React.ReactElement;
      expect(renderer.type).toBe(FilterableHeaderCell);
    });

    afterEach(() => {
      defaultProps.columns[customColumnIdx].headerRenderer = undefined;
      defaultProps.columns[customColumnIdx].filterable = false;
    });
  });

  describe('Rendering HeaderRow component', () => {
    const renderComponent = (props: HeaderRowProps) => {
      return shallow(<HeaderRow {...props} />);
    };

    const requiredProps: HeaderRowProps = {
      height: 35,
      columns: helpers.columns,
      onSort: jest.fn(),
      rowType: HeaderRowType.HEADER,
      onColumnResize: jest.fn(),
      onColumnResizeEnd: jest.fn(),
      onFilterChange() {},
      onHeaderDrop() {},
      draggableHeaderCell: () => <div />
    };

    const allProperties: HeaderRowProps = {
      height: 35,
      columns: helpers.columns,
      onSort: jest.fn(),
      rowType: HeaderRowType.HEADER,
      onColumnResize: jest.fn(),
      onColumnResizeEnd: jest.fn(),
      width: 200,
      style: {
        overflow: 'scroll',
        width: 201,
        height: 36,
        position: 'relative'
      },
      sortColumn: 'sortColumnValue',
      sortDirection: DEFINE_SORT.NONE,
      filterable: true,
      onFilterChange() {},
      onHeaderDrop() {},
      draggableHeaderCell: () => <div />
    };

    it('passes classname property', () => {
      const wrapper = renderComponent(requiredProps);
      const headerRowDiv = wrapper.find('div').at(0);
      expect(headerRowDiv.hasClass('react-grid-HeaderRow'));
    });
    it('does not pass width if not available from props', () => {
      const wrapper = renderComponent(requiredProps);
      const headerRowDiv = wrapper.find('div').at(0);
      expect(headerRowDiv.props().width).toBeUndefined();
    });
    it('passes style property, if available from props', () => {
      const wrapper = renderComponent(allProperties);
      const headerRowDiv = wrapper.find('div').at(0);
      expect(headerRowDiv.props().style).toBe(allProperties.style);
    });
    it('does not pass style if not available from props', () => {
      const wrapper = renderComponent(requiredProps);
      const headerRowDiv = wrapper.find('div').at(0);
      expect(headerRowDiv.props().style).toBeUndefined();
    });
  });
});
