<?php

namespace Shopsys\FrameworkBundle\Model\Product\Parameter;

class ParameterData
{
    /**
     * @var string[]|null[]
     */
    public $name;

    /**
     * @var bool
     */
    public $visible;

    public function __construct()
    {
        $this->name = [];
        $this->visible = false;
    }
}
