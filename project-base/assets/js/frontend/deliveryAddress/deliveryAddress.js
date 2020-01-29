import Register from 'framework/common/utils/register';

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

    updateForm ($select, deliveryAddress) {
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

    getFormInputNames () {
        return ['firstName', 'lastName', 'companyName', 'telephone', 'street', 'city', 'postcode', 'country'];
    }

    static init ($container) {
        const $deliveryAddressSelect = $container.filterAllNodes('.js-delivery-address-select');
        const deliveryAddress = new DeliveryAddress();

        $deliveryAddressSelect.change((event) => deliveryAddress.onDeliveryAddressChange(event.currentTarget, deliveryAddress, $deliveryAddressRemove));

        deliveryAddress.updateForm($deliveryAddressSelect, deliveryAddress);
    }
}

(new Register()).registerCallback(DeliveryAddress.init);
