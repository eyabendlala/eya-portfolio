<?php

namespace App\Form;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use App\Entity\Evenement;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class EvenementType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('NomEvenement')
            ->add('Description')
            ->add('NombreDeParticipants')
            ->add('QrCode', FileType::class, ([
                 'mapped' => false,
                 'label'=>'ajouter votre image']
               ))
            ->add('Billet')
            ->add('DateDeEvenement')
            ->add('longitude')
            ->add('latitude')



            ->add('collaborateur1' , EntityType::class, array(
                'class' => 'App\Entity\Collaborateur',
                'choice_label' => function ($Collaborateur){ 
                   
                    return $Collaborateur->getNomCollaborateur() . ' ' . $Collaborateur->getRole();}
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Evenement::class,
        ]);
    }
}
