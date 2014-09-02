<?php

namespace SS6\ShopBundle\Model\Customer;

class DeliveryAddressData {

	/**
	 * @var boolean
	 */
	private $addressFilled;

	/**
	 * @var string|null
	 */
	private $companyName;

	/**
	 * @var string|null
	 */
	private $contactPerson;

	/**
	 * @var string|null
	 */
	private $telephone;

	/**
	 * @var string|null
	 */
	private $street;

	/**
	 * @var string|null
	 */
	private $city;

	/**
	 * @var string|null
	 */
	private $postcode;

	/**
	 * @param boolean $addressFilled
	 * @param string|null $street
	 * @param string|null $city
	 * @param string|null $postcode
	 * @param string|null $companyName
	 * @param string|null $contactPerson
	 * @param string|null $telephone
	 */
	public function __construct(
		$addressFilled = false,
		$street = null,
		$city = null,
		$postcode = null,
		$companyName = null,
		$contactPerson = null,
		$telephone = null
	) {
		$this->addressFilled = $addressFilled;
		$this->street = $street;
		$this->city = $city;
		$this->postcode = $postcode;
		$this->companyName = $companyName;
		$this->contactPerson = $contactPerson;
		$this->telephone = $telephone;
	}

	/**
	 * @return bool
	 */
	public function getAddressFilled() {
		return $this->addressFilled;
	}

	/**
	 * @return string|null
	 */
	public function getCompanyName() {
		return $this->companyName;
	}

	/**
	 * @return string|null
	 */
	public function getContactPerson() {
		return $this->contactPerson;
	}

	/**
	 * @return string|null
	 */
	public function getTelephone() {
		return $this->telephone;
	}

	/**
	 * @return string|null
	 */
	public function getStreet() {
		return $this->street;
	}

	/**
	 * @return string|null
	 */
	public function getCity() {
		return $this->city;
	}

	/**
	 * @return string|null
	 */
	public function getPostcode() {
		return $this->postcode;
	}

	/**
	 * @param bool $addressFilled
	 */
	public function setAddressFilled($addressFilled) {
		$this->addressFilled = $addressFilled;
	}

	/**
	 * @param string|null $companyName
	 */
	public function setCompanyName($companyName) {
		$this->companyName = $companyName;
	}

	/**
	 * @param string|null $contactPerson
	 */
	public function setContactPerson($contactPerson) {
		$this->contactPerson = $contactPerson;
	}

	/**
	 * @param string|null $telephone
	 */
	public function setTelephone($telephone) {
		$this->telephone = $telephone;
	}

	/**
	 * @param string|null $street
	 */
	public function setStreet($street) {
		$this->street = $street;
	}

	/**
	 * @param string|null $city
	 */
	public function setCity($city) {
		$this->city = $city;
	}

	/**
	 * @param string|null $postcode
	 */
	public function setPostcode($postcode) {
		$this->postcode = $postcode;
	}

	/**
	 * @param \SS6\ShopBundle\Model\Customer\DeliveryAddress|null $deliveryAddress
	 */
	public function setFromEntity(DeliveryAddress $deliveryAddress = null) {
		if ($deliveryAddress !== null) {
			$this->addressFilled = true;
			$this->companyName = $deliveryAddress->getCompanyName();
			$this->contactPerson = $deliveryAddress->getContactPerson();
			$this->telephone = $deliveryAddress->getTelephone();
			$this->street = $deliveryAddress->getStreet();
			$this->city = $deliveryAddress->getCity();
			$this->postcode = $deliveryAddress->getPostcode();
		} else {
			$this->addressFilled = false;
		}
	}

}
