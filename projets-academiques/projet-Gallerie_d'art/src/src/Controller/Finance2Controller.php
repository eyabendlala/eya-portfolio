<?php

namespace App\Controller;

use App\Entity\Finance2;
use App\Form\Finance2Type;
use App\Repository\Finance2Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/finance2")
 */
class Finance2Controller extends AbstractController
{
    /**
     * @Route("/", name="finance2_index", methods={"GET"})
     */
    public function index(Finance2Repository $finance2Repository): Response
    {
        return $this->render('finance2/index.html.twig', [
            'finance2s' => $finance2Repository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="finance2_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $finance2 = new Finance2();
        $form = $this->createForm(Finance2Type::class, $finance2);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($finance2);
            $entityManager->flush();

            return $this->redirectToRoute('finance2_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('finance2/new.html.twig', [
            'finance2' => $finance2,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="finance2_show", methods={"GET"})
     */
    public function show(Finance2 $finance2): Response
    {
        return $this->render('finance2/show.html.twig', [
            'finance2' => $finance2,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="finance2_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Finance2 $finance2, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(Finance2Type::class, $finance2);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('finance2_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('finance2/edit.html.twig', [
            'finance2' => $finance2,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="finance2_delete", methods={"POST"})
     */
    public function delete(Request $request, Finance2 $finance2, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$finance2->getId(), $request->request->get('_token'))) {
            $entityManager->remove($finance2);
            $entityManager->flush();
        }

        return $this->redirectToRoute('finance2_index', [], Response::HTTP_SEE_OTHER);
    }

/**
     * @Route("/fin2/mobi", name="finance2_mob", methods={"GET", "POST"})
     */
    public function fin2(Request $request)
    {
    $finance2= new Finance2();

 $dons = $request->query->get("dons");
 $evenement = $request->query->get("evenement"); 
 $commande = $request->query->get("commande"); 
 $somme = $request->query->get("somme"); 
 $date = $request->query->get("date"); 
 $em = $this->getDoctrine()->getManager();

 $finance2->setDons($dons);
$finance2->setEvenement($evenement);
 $finance2->setCommande($commande);
 $finance2->setSomme($somme);
 $finance2->setDate($date);
 $em->persist($finance2);
 $em->flush();
 $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($finance2);
 return new JsonResponse($formatted);

    }
/**
     * @Route("/fi/liste", name="listefinace2")
     */
    public function listefinace2(Finance2Repository $finance2Repository ,NormalizerInterface $Normalizer)
    {
     $liste=$finance2Repository->findAll();
    
      $jsonContent=$Normalizer->normalize($liste,'json',['groups'=>'post:read']);
      dump($jsonContent); 
    die();
     // return new Response(json_encode($jsonContent));

    }

/**
     * @Route("/modifi/fi", name="finance2_modif", methods={"GET", "POST","PUT"})
     */
    public function modif(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $finance = $em->getRepository(Finance2::class)->find($id);
        $finance ->setDons($request->query->get("dons"));
        $finance ->setEvenement($request->query->get("evenement"));
        $finance->setDate($request->query->get("date"));
        $finance->setSomme($request->query->get("somme"));
        $em->persist($finance);
         $em->flush();
      $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($finance);
 return new JsonResponse("bilan financiere modifiee avec succes ! ");

    }
/**
     * @Route("/finsup/fin2", name="finance-supprimer", methods={"GET", "POST"})
     */
    public function suppfin(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $finance = $em->getRepository(Finance2::class)->find($id);
        if($finance!=null){
            $em->remove($finance);
            $em->flush();
            $serializer = new Serializer([new ObjectNormalizer()]);
            $formatted =$serializer->normalize("bilan financiere supprimeé avec succes !!");
            return new JsonResponse($formatted);
        }
        return new JsonResponse("id  invalid !");
    }








}
