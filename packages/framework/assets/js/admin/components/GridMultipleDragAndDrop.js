import Ajax from '../../common/utils/Ajax';
import Window from '../utils/Window';
import Register from '../../common/utils/Register';
import Translator from 'bazinga-translator';

export default class GridMultipleDragAndDrop {

    constructor () {
        this.toggleRowHolders();

        const _this = this;
        $('.js-multiple-grids-save-all-button').click((event) => this.saveOrdering(event));
        $('.js-multiple-grids-rows-unified').sortable({
            cursor: 'move',
            handle: '.cursor-move',
            items: '.js-grid-row, .js-grid-row-holder',
            placeholder: 'in-drop-place',
            revert: 200,
            change: () => _this.onUpdate(),
            update: () => _this.onUpdate()
        });
    }

    saveOrdering (event) {
        const $saveButton = $(event.target);
        const $grids = $saveButton.closest('.js-multiple-grids-rows-unified').find('.js-grid');
        const data = {
            rowIdsByGridId: this.getPositionsIndexedByGridId($grids)
        };

        Ajax.ajax({
            loaderElement: '.js-multiple-grids-save-all-button',
            url: $saveButton.data('drag-and-drop-url-save-ordering'),
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function () {
                // eslint-disable-next-line no-new
                new Window({
                    content: Translator.trans('Order saved')
                });
            },
            error: function () {
                // eslint-disable-next-line no-new
                new Window({
                    content: Translator.trans('Order saving failed')
                });
            }
        });

        $saveButton.addClass('btn--disabled');
    }

    getPositionsIndexedByGridId ($grids) {
        const rowIdsIndexedByGridId = {};
        $.each($grids, function (index, grid) {
            const $grid = $(grid);
            const gridId = $grid.data('grid-id');
            rowIdsIndexedByGridId[gridId] = {};
            const rows = $grid.find('.js-grid-row');

            $.each(rows, function (rowIndex, row) {
                rowIdsIndexedByGridId[gridId][rowIndex] = $(row).data('drag-and-drop-grid-row-id');
            });
        });

        return rowIdsIndexedByGridId;
    }

    toggleRowHolders () {
        $('.js-multiple-grids-rows-unified .js-grid').each(function () {
            const gridRowsCount = $(this).find('.js-grid-row:not(.ui-sortable-helper):not(.js-grid-row-holder), .in-drop-place').length;
            const $rowHolder = $(this).find('.js-grid-row-holder');
            $rowHolder.toggle(gridRowsCount === 0);
        });
    }

    onUpdate () {
        $('.js-multiple-grids-save-all-button').removeClass('btn--disabled');
        this.toggleRowHolders();
    }

    static init () {
        // eslint-disable-next-line no-new
        new GridMultipleDragAndDrop();
    }
}

(new Register()).registerCallback(GridMultipleDragAndDrop.init, 'GridMultipleDragAndDrop.init');
