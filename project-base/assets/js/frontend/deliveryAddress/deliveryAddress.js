import Register from 'framework/common/utils/register';
import Ajax from 'framework/common/utils/ajax';
import Window from '../utils/window';
import Translator from 'bazinga-translator';

export default class DeliveryAddress {
    onDeliveryAddressChange ($this, deliveryAddress, $deliveryAddressRemove) {

        $this = $($this);
        const $option = $this.children('option:selected');
        const inputNames = deliveryAddress.getFormInputNames();

        if (parseInt($option.val()) > 0) {
            const $address = $option.data('js-address');

            for (const key in inputNames) {
                deliveryAddress.setValue('.js-delivery-address-' + inputNames[key], $address[inputNames[key]]);
            }
        } else {
            for (const key in inputNames) {
                deliveryAddress.setEmptyValue('.js-delivery-address-' + inputNames[key]);
            }
        }

        deliveryAddress.updateForm($this, deliveryAddress, $deliveryAddressRemove);
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

    updateForm ($select, deliveryAddress, $deliveryAddressRemove) {
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

        if ($select.val() == '') {
            $deliveryAddressRemove.hide();
        } else {
            $deliveryAddressRemove.show();
        }
    }

    onRemove ($this, deliveryAddress, $deliveryAddressSelect) {
        $this = $($this);
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

    static init ($container) {
        const $deliveryAddressSelect = $container.filterAllNodes('.js-delivery-address-select');
        const $deliveryAddressRemove = $container.filterAllNodes('.js-delivery-address-remove-button');
        const deliveryAddress = new DeliveryAddress();

        $deliveryAddressSelect.change((event) => deliveryAddress.onDeliveryAddressChange(event.currentTarget, deliveryAddress, $deliveryAddressRemove));
        $deliveryAddressRemove.click((event) => deliveryAddress.onRemove(event.currentTarget, deliveryAddress, $deliveryAddressSelect));

        deliveryAddress.updateForm($deliveryAddressSelect, deliveryAddress, $deliveryAddressRemove);
    }
}

(new Register()).registerCallback(DeliveryAddress.init);
