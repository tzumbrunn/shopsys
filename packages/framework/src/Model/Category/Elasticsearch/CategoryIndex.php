<?php

declare(strict_types=1);

namespace Shopsys\FrameworkBundle\Model\Category\Elasticsearch;

use Shopsys\FrameworkBundle\Component\Domain\Domain;
use Shopsys\FrameworkBundle\Component\Elasticsearch\AbstractIndex;
use Shopsys\FrameworkBundle\Model\Category\Category;
use Shopsys\FrameworkBundle\Model\Category\CategoryRepository;

class CategoryIndex extends AbstractIndex
{
    public const INDEX_NAME = 'category';

    /**
     * @var \Shopsys\FrameworkBundle\Model\Category\CategoryRepository
     */
    protected $categoryRepository;

    /**
     * @var \Shopsys\FrameworkBundle\Component\Domain\Domain
     */
    protected $domain;

    /**
     * CategoryIndex constructor.
     *
     * @param \Shopsys\FrameworkBundle\Model\Category\CategoryRepository $categoryRepository
     * @param \Shopsys\FrameworkBundle\Component\Domain\Domain $domain
     */
    public function __construct(CategoryRepository $categoryRepository, Domain $domain)
    {
        $this->categoryRepository = $categoryRepository;
        $this->domain = $domain;
    }

    /**
     * @return string
     */
    public static function getName(): string
    {
        return static::INDEX_NAME;
    }

    /**
     * @param int $domainId
     * @return int
     */
    public function getTotalCount(int $domainId): int
    {
        return count($this->categoryRepository->getTranslatedVisibleSubcategoriesByDomain(
            $this->categoryRepository->getRootCategory(),
            $this->domain->getDomainConfigById($domainId)
        ));
    }

    /**
     * @param int $domainId
     * @param array $restrictToIds
     * @return array
     */
    public function getExportDataForIds(int $domainId, array $restrictToIds): array
    {
        $categories = $this->categoryRepository->getCategoriesByIds($restrictToIds);

        $domainConfig = $this->domain->getDomainConfigById($domainId);
        $locale = $domainConfig->getLocale();
        $result = [];
        foreach ($categories as $category) {
            $result[$category->getId()] = $this->convertToElastic($category, $domainId, $locale);
        }
        return $result;
    }

    /**
     * @param int $domainId
     * @param int $lastProcessedId
     * @param int $batchSize
     * @return array
     */
    public function getExportDataForBatch(int $domainId, int $lastProcessedId, int $batchSize): array
    {
        $domainConfig = $this->domain->getDomainConfigById($domainId);
        $categories = $this->categoryRepository->getTranslatedVisibleSubcategoriesByDomain(
            $this->categoryRepository->getRootCategory(),
            $domainConfig
        );

        $result = [];
        $locale = $domainConfig->getLocale();
        foreach ($categories as $category) {
            $result[$category->getId()] = $this->convertToElastic($category, $domainId, $locale);
        }
        return $result;
    }

    /**
     * @param \Shopsys\FrameworkBundle\Model\Category\Category $category
     * @param int $domainId
     * @param string $locale
     * @return array
     */
    protected function convertToElastic(Category $category, int $domainId, string $locale): array
    {
        return [
            'name' => $category->getName($locale),
            'description' => $category->getDescription($domainId),
            'parentId' => $category->getParent()->getId(),
            'level' => $category->getLevel(),
            'uuid' => $category->getUuid(),
        ];
    }
}
