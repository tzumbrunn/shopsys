<?php

declare(strict_types=1);

namespace Shopsys\FrameworkBundle\Model\Customer;

interface CustomerDataFactoryInterface
{
    /**
     * @return \Shopsys\FrameworkBundle\Model\Customer\CustomerData
     */
    public function create(): CustomerData;

    /**
     * @param int $domainId
     * @return \Shopsys\FrameworkBundle\Model\Customer\CustomerData
     */
    public function createForDomain(int $domainId): CustomerData;

    /**
     * @param \Shopsys\FrameworkBundle\Model\Customer\Customer $customer
     * @return \Shopsys\FrameworkBundle\Model\Customer\CustomerData
     */
    public function createFromCustomer(Customer $customer): CustomerData;
}
