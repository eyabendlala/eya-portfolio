<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('Nom')
            ->add('Prenom')
            ->add('CIN')
            ->add('Password' ,PasswordType::class ,([
            
                ]))
            ->add('Role', HiddenType::class,['data' => 'Admin'])
            ->add('Access', ChoiceType::class, [
                'choices'  => [
                    'Admin' => "Admin",
                    'Depfinance' => "Depfinance",
                    'Depcom' => "Depcom",
                ],'help' => 'Choisire le type d abonnement',
            ])
            ->add('image', FileType::class, ([
            
                'mapped' => false,
                'label'=>'ajouter votre image',
               ]
              ))
              ->add('datenaissance', DateType::class, [
                'widget' => 'single_text',
                // this is actually the default format for single_text
                'format' => 'yyyy-MM-dd',
            ]);
              ;
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
