<?php

declare(strict_types=1);

namespace App\Controller\Front;

use App\Form\Front\Newsletter\SubscriptionFormType;
use Shopsys\FrameworkBundle\Component\Domain\Domain;
use Shopsys\FrameworkBundle\Model\LegalConditions\LegalConditionsFacade;
use Shopsys\FrameworkBundle\Model\Newsletter\NewsletterFacade;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class NewsletterController extends FrontBaseController
{
    /**
     * @var \Shopsys\FrameworkBundle\Model\Newsletter\NewsletterFacade
     */
    private $newsletterFacade;

    /**
     * @var \Shopsys\FrameworkBundle\Model\LegalConditions\LegalConditionsFacade
     */
    private $legalConditionsFacade;

    /**
     * @var \Shopsys\FrameworkBundle\Component\Domain\Domain
     */
    private $domain;

    /**
     * @param \Shopsys\FrameworkBundle\Model\Newsletter\NewsletterFacade $newsletterFacade
     * @param \Shopsys\FrameworkBundle\Model\LegalConditions\LegalConditionsFacade $legalConditionsFacade
     * @param \Shopsys\FrameworkBundle\Component\Domain\Domain $domain
     */
    public function __construct(
        NewsletterFacade $newsletterFacade,
        LegalConditionsFacade $legalConditionsFacade,
        Domain $domain
    ) {
        $this->newsletterFacade = $newsletterFacade;
        $this->legalConditionsFacade = $legalConditionsFacade;
        $this->domain = $domain;
    }

    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response|NULL
     */
    public function subscribeEmailAction(Request $request)
    {
        $form = $this->createSubscriptionForm();
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $email = $form->getData()['email'];
            $this->newsletterFacade->addSubscribedEmail($email, $this->domain->getId());
        }

        return $this->renderSubscription($form);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function subscriptionAction(): Response
    {
        $form = $this->createSubscriptionForm();

        return $this->renderSubscription($form);
    }

    /**
     * @return \Symfony\Component\Form\Form
     */
    private function createSubscriptionForm(): Form
    {
        /** @var \Symfony\Component\Form\Form $form */
        $form = $this->createForm(SubscriptionFormType::class, null, [
            'action' => $this->generateUrl('front_newsletter_send'),
        ]);

        return $form;
    }

    /**
     * @param \Symfony\Component\Form\Form $form
     * @return \Symfony\Component\HttpFoundation\Response
     */
    private function renderSubscription(Form $form): Response
    {
        $privacyPolicyArticle = $this->legalConditionsFacade->findPrivacyPolicy($this->domain->getId());

        return $this->render('Front/Inline/Newsletter/subscription.html.twig', [
            'form' => $form->createView(),
            'success' => $form->isSubmitted() && $form->isValid(),
            'privacyPolicyArticle' => $privacyPolicyArticle,
        ]);
    }
}
