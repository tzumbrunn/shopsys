<?php

namespace Shopsys\FrameworkBundle\Component\Javascript\Parser\Translator;

use Shopsys\FrameworkBundle\Component\Javascript\Parser\JsFunctionCallParser;
use Shopsys\FrameworkBundle\Component\Javascript\Parser\JsStringParser;
use Shopsys\FrameworkBundle\Component\Translation\TransMethodSpecification;

class JsTranslatorCallParserFactory
{
    public const METHOD_NAME_TRANS = 'Translator.trans';
    public const METHOD_NAME_TRANS_CHOICE = 'Translator.transChoice';

    /**
     * @var \Shopsys\FrameworkBundle\Component\Javascript\Parser\JsFunctionCallParser
     */
    protected $jsFunctionCallParser;

    /**
     * @var \Shopsys\FrameworkBundle\Component\Javascript\Parser\JsStringParser
     */
    protected $jsStringParser;

    /**
     * @param \Shopsys\FrameworkBundle\Component\Javascript\Parser\JsFunctionCallParser $jsFunctionCallParser
     * @param \Shopsys\FrameworkBundle\Component\Javascript\Parser\JsStringParser $jsStringParser
     */
    public function __construct(
        JsFunctionCallParser $jsFunctionCallParser,
        JsStringParser $jsStringParser
    ) {
        $this->jsFunctionCallParser = $jsFunctionCallParser;
        $this->jsStringParser = $jsStringParser;
    }

    /**
     * @return \Shopsys\FrameworkBundle\Component\Javascript\Parser\Translator\JsTranslatorCallParser
     */
    public function create()
    {
        $transMethodSpecifications = [
            new TransMethodSpecification(self::METHOD_NAME_TRANS, 0, 2),
            new TransMethodSpecification(self::METHOD_NAME_TRANS_CHOICE, 0, 3),
        ];

        return new JsTranslatorCallParser(
            $this->jsFunctionCallParser,
            $this->jsStringParser,
            $transMethodSpecifications
        );
    }
}
