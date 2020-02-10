import Register from 'framework/common/utils/register';
import Ajax from 'framework/common/utils/ajax';
import Window from '../utils/window';
import Translator from 'bazinga-translator';
import CheckboxToggle from 'framework/common/components/checkboxToggle';

export default class DeliveryAddress {
    onEdit ($editButton, deliveryAddress, $deliveryAddressRemove, $addressContainer) {
        const inputNames = deliveryAddress.getFormInputNames();
        const $address = $editButton.data('js-address');

        for (const key in inputNames) {
            deliveryAddress.setValue('.js-delivery-address-' + inputNames[key], $address[inputNames[key]]);
        }

        deliveryAddress.updateForm($editButton, deliveryAddress, $deliveryAddressRemove);
        $addressContainer.show();
        console.log($addressContainer);
    }

    setValue (selector, value) {
        const $input = $(selector);
        $input.val(value);
    }

    setEmptyValue (selector) {
        const $input = $(selector);

        if ($input.is('select')) {
            $input.find('option').prop('selected', false);
            $input.val($input.find('option:first').val());
        } else {
            $input.val('');
        }
    }

    disableInput (selector) {
        const $input = $(selector);

        if ($input.is('select')) {
            $input.attr('disabled', 'disabled');
        } else {
            $input.attr('readonly', 'readonly');
        }
    }

    enableInput (selector) {
        const $input = $(selector);

        if ($input.is('select')) {
            $input.removeAttr('disabled');
        } else {
            $input.removeAttr('readonly');
        }
    }

    updateForm ($select, deliveryAddress) {
        const disableFields = $select.data('js-address-disable-fields');
        if (disableFields) {
            const inputNames = deliveryAddress.getFormInputNames();

            if ($select.val() == '') {
                for (const key in inputNames) {
                    deliveryAddress.enableInput('.js-delivery-address-' + inputNames[key]);
                }
            } else {
                for (const key in inputNames) {
                    deliveryAddress.disableInput('.js-delivery-address-' + inputNames[key]);
                }
            }
        }
    }

    onRemove ($this, deliveryAddress, $deliveryAddressSelect) {
        const deliveryAddressId = $deliveryAddressSelect.val();
        if (deliveryAddressId > 0) {
            const url = $this.data('href') + '/' + deliveryAddressId;
            Ajax.ajax({
                overlayDelay: 0,
                loaderElement: '#js-delivery-address-fields',
                url: url,
                type: 'get',
                success: function () {
                    deliveryAddress.deleteSuccessMessage();
                    $deliveryAddressSelect.find('option:selected').remove();
                    deliveryAddress.onDeliveryAddressChange($deliveryAddressSelect, deliveryAddress, $this);
                },
                error: function () {
                    deliveryAddress.deleteErrorMessage();
                }
            });
        }
    }

    deleteSuccessMessage () {
        return new Window({
            content: Translator.trans('Delivery address has been removed.')
        });
    }

    deleteErrorMessage () {
        return new Window({
            content: Translator.trans('Delivery address could not be removed.')
        });
    }

    getFormInputNames () {
        return ['firstName', 'lastName', 'companyName', 'telephone', 'street', 'city', 'postcode', 'country'];
    }

    isAddressEmpty (deliveryAddress) {
        const inputNames = deliveryAddress.getFormInputNames();
        let isAddressEmpty = true;

        for (const key in inputNames) {
            if (inputNames[key] == 'country') {
                continue;
            }

            if ($('.js-delivery-address-' + inputNames[key]).val() != '') {
                isAddressEmpty = false;
            }
        }

        return isAddressEmpty;
    }

    onChange ($input, deliveryAddress, $addressContainer) {
        const inputNames = deliveryAddress.getFormInputNames();

        if ($input.val() != '') {
            if (deliveryAddress.isAddressEmpty(deliveryAddress)) {
                $addressContainer.hide();
            }
        } else {
            for (const key in inputNames) {
                deliveryAddress.setEmptyValue('.js-delivery-address-' + inputNames[key]);
            }

            $addressContainer.show();
        }
    }

    static init ($container) {
        const $deliveryAddressEdit = $container.filterAllNodes('.js-delivery-address-edit-button');
        const $deliveryAddressRemove = $container.filterAllNodes('.js-delivery-address-remove-button');
        const $deliveryAddressInput = $container.filterAllNodes('.js-delivery-address-input');
        const $addressContainer = (new CheckboxToggle($container)).findContainer($('.js-delivery-address-toggle'));
        const deliveryAddress = new DeliveryAddress();

        $deliveryAddressEdit.click((event) => deliveryAddress.onEdit($(event.currentTarget), deliveryAddress, $deliveryAddressRemove, $addressContainer));
        $deliveryAddressRemove.click((event) => deliveryAddress.onRemove($(event.currentTarget), deliveryAddress, $deliveryAddressEdit));
        $deliveryAddressInput.change((event) => deliveryAddress.onChange($(event.currentTarget), deliveryAddress, $addressContainer));

        deliveryAddress.updateForm($deliveryAddressEdit, deliveryAddress);
    }
}

(new Register()).registerCallback(DeliveryAddress.init);
