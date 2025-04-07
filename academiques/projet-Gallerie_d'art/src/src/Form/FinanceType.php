<?php

namespace App\Form;

use App\Entity\Finance;
use App\Entity\Dons;
use App\Entity\Commande;
use App\Entity\Evenement;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\DateType;


class FinanceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('date',DateType::class, [
                'widget' => 'single_text',
            ])
            ->add('dons',EntityType::class ,['class'=> Dons::class,
            'choice_label'=>'montant'])
            ->add('color1', ColorType::class)
            ->add('evenement',EntityType::class ,['class'=> Evenement::class,
            'choice_label'=>'billet'])
            ->add('color2', ColorType::class)
            ->add('commande',EntityType::class,['class'=> Commande::class,
            'choice_label'=>'total'])
            ->add('color3', ColorType::class)
            ->add('somme')
            ->add('add', SubmitType::class ,['label'=>'Valider'])
        ;
    }

   
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Finance::class,
        ]);
    }
}
