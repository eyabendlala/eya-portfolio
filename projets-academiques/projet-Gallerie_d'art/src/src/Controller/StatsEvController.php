<?php

namespace App\Controller;
use App\Entity\Evenement;
use App\Entity\Collaborateur;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StatsEvController extends AbstractController
{
    /**
     * @Route("/stats", name="stats")
     */
    public function index(): Response
    {


        $Entreprises=$this->getDoctrine()->getRepository(Evenement::class)->findAll();
        $EntreprisesNbr=sizeof($Entreprises);


        $Etudiants=$this->getDoctrine()->getRepository(Collaborateur::class)->findAll();
        $EtudiantsNbr=sizeof($Etudiants);



        return $this->render('stats/index.html.twig', [
            'controller_name' => 'StatistiquesController',
            'EntreprisesNbr'=>$EntreprisesNbr,'EtudiantsNbr'=>$EtudiantsNbr
        ]);
    }
}
