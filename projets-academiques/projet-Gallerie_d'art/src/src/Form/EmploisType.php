<?php

namespace App\Form;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Entity\Emplois;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
class EmploisType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    { 
        $builder
        ->add('Ddebut', DateTimeType::class, [
            'widget' => 'single_text',
            // this is actually the default format for single_text
          
        ])
        ->add('Dfin', DateTimeType::class, [
            'widget' => 'single_text',
            // this is actually the default format for single_text
          
        ])
            
            
         
            ->add('User' , EntityType::class, array(
                'class' => 'App\Entity\User',
                'choice_label' => function ($User){ 
                    if($User->getRole()=='Admin'){
                    return $User->getCIN() . ' ' . $User->getnom() . ' ' . $User->getprenom();}}
            ))
            /*->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
                    // ... adding the name field if needed
                    $form = $event->getForm();
                    $user = $form->get('CIN')->getData();
                    if($user=='2'){
                    $form->add('nom', TextType::class,['data' => 'Membre']);}
                });$builder->add('CIN', TextType::class,['data' => '2'])
               // ->add('nom', TextType::class,['data' => $User.getid()])
                //>add('prenom', TextType::class,['data' => 'Membre'])
                //->add('CIN', TextType::class,['data' => 'Membre'])
       ->add('nom' ,string, array(
            'class' => 'App\Entity\User',
            'choice_label' => 'nom'))
    ->add('prenom' , EntityType::class, array(
        'class' => 'App\Entity\User',
        'choice_label' => 'prenom'))
        ->add('CIN' , EntityType::class, array(
            'class' => 'App\Entity\User',
            'choice_label' => 'CIN'))*/
    
;
/*$builder->get('User')->addEventListener(
    FormEvents::POST_SET_DATA,
    function (FormEvent $event){
        $form = $event->getForm();
        $form->getParent()->add('nom');
    }
);*/
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Emplois::class,
        ]);
    }
}
