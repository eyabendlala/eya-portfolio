<?php

namespace App\Controller;
use App\Entity\User;
use App\Form\UserType;
use App\Form\UserFrontType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StatistiquesController extends AbstractController
{
    /**
     * @Route("/statistiques1", name="statistiques")
     */
    public function index(): Response
    {


        $Entreprises=$this->getDoctrine()->getRepository(User::class)->findBy(['Role' =>'Admin']);
        $EntreprisesNbr=sizeof($Entreprises);


        $Etudiants=$this->getDoctrine()->getRepository(User::class)->findBy(['Role' => 'Membre']);
        $EtudiantsNbr=sizeof($Etudiants);



        return $this->render('statistiques/index.html.twig', [
            'controller_name' => 'StatistiquesController',
            'EntreprisesNbr'=>$EntreprisesNbr,'EtudiantsNbr'=>$EtudiantsNbr
        ]);
    }
}
