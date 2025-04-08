<?php

namespace App\Controller;

use App\Entity\Reponse;
use App\Form\ReponseType;
use App\Repository\ReponseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\HttpFoundation\JsonResponse ;
use App\Entity\Reclamation;
use App\Form\ReclamationType;
use App\Repository\ReclamationRepository;

/**
 * @Route("/reponse")
 */
class ReponseController extends AbstractController
{
    /**
     * @Route("/", name="reponse_index", methods={"GET"})
     */
    public function index(ReponseRepository $reponseRepository): Response
    {
        return $this->render('reponse/index.html.twig', [
            'reponses' => $reponseRepository->findAll(),
        ]);
    }


/**
     * @Route("/back", name="reponse_index_back", methods={"GET"})
     */
    public function index2(ReponseRepository $reponseRepository): Response
    {
        return $this->render('reponse-back/index.html.twig', [
            'reponses' => $reponseRepository->findAll(),
        ]);
    }


    /**
     * @Route("/new", name="reponse_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $reponse = new Reponse();
        $form = $this->createForm(ReponseType::class, $reponse);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($reponse);
            $entityManager->flush();

            return $this->redirectToRoute('reponse_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reponse/new.html.twig', [
            'reponse' => $reponse,
            'form' => $form->createView(),
        ]);
    }


/**
     * @Route("/back/new", name="reponse_new_back", methods={"GET", "POST"})
     */
    public function new2(Request $request, EntityManagerInterface $entityManager): Response
    {
        $reponse = new Reponse();
        $form = $this->createForm(ReponseType::class, $reponse);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($reponse);
            $entityManager->flush();

            return $this->redirectToRoute('reponse_index_back', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reponse-back/new.html.twig', [
            'reponse' => $reponse,
            'form' => $form->createView(),
        ]);
    }




    /**
     * @Route("/{id}", name="reponse_show", methods={"GET"})
     */
    public function show(Reponse $reponse): Response
    {
        return $this->render('reponse/show.html.twig', [
            'reponse' => $reponse,
        ]);
    }

    /**
     * @Route("/back/{id}", name="reponse_show_back", methods={"GET"}, requirements={"id":"\d+"})
    
     */
    public function show2(Reponse $reponse): Response
    {
        return $this->render('reponse-back/show.html.twig', [
            'reponse' => $reponse,
        ]);
    }
        /**
     * @Route("/back1/{id}", name="reponse_show2_back", methods={"GET"}, requirements={"id":"\d+"})
    
     */
    public function show12(Reponse $reponse): Response
    {
        return $this->render('reponse-back/show2.html.twig', [
            'reponse' => $reponse,
        ]);
    }



    /**
     * @Route("/{id}/edit", name="reponse_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Reponse $reponse, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ReponseType::class, $reponse);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('reponse_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reponse/edit.html.twig', [
            'reponse' => $reponse,
            'form' => $form->createView(),
        ]);
    }
    /**
     * @Route("/back/{id}/edit", name="reponse_edit_back", methods={"GET", "POST"})
     */
    public function edit2(Request $request, Reponse $reponse, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ReponseType::class, $reponse);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('reponse_index_back', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reponse-back/edit.html.twig', [
            'reponse' => $reponse,
            'form' => $form->createView(),
        ]);
    }




    /**
     * @Route("/{id}", name="reponse_delete", methods={"POST"})
     */
    public function delete(Request $request, Reponse $reponse, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$reponse->getId(), $request->request->get('_token'))) {
            $entityManager->remove($reponse);
            $entityManager->flush();
        }

        return $this->redirectToRoute('reponse_index', [], Response::HTTP_SEE_OTHER);
    }




    /**
     * @Route("/back/{id}", name="reponse_delete_back", methods={"POST"})
     */
    public function delete2(Request $request, Reponse $reponse, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$reponse->getId(), $request->request->get('_token'))) {
            $entityManager->remove($reponse);
            $entityManager->flush();
        }

        return $this->redirectToRoute('reponse_index_back', [], Response::HTTP_SEE_OTHER);
    }

     /**
     * @Route("/TrierParNomDESCr", name="TrierParNomDESCr")
     */
    public function TrierParNomr(Request $request): Response
    {
        $repository = $this->getDoctrine()->getRepository(Evenement::class);
        $evenements = $repository->findByNamer();

        return $this->render('evenement/index.html.twig', [
            'evenements' => $evenements,
        ]);
    }
    /**
     * @Route("/rep/Trieasc", name="Trieasc")
     */
    public function Trieasc(Request $request): Response
    {
        $repository = $this->getDoctrine()->getRepository(Reponse::class);
        $reponses = $repository->findByrepasc();

        return $this->render('reponse/index.html.twig', [
            'reponses' => $reponses,
        ]);
    }
    /**
     * @Route("/rep/Triedsc", name="Triedsc")
     */
    public function Triedsc(Request $request): Response
    {
        $repository = $this->getDoctrine()->getRepository(Reponse::class);
        $reponses = $repository->findByrepdsc();

        return $this->render('reponse/index.html.twig', [
            'reponses' => $reponses,
        ]);
    }


 /**
     * @Route("/rep/Trieasc1", name="Trieasc1")
     */
    public function Trieasc1(Request $request): Response
    {
        $repository = $this->getDoctrine()->getRepository(Reponse::class);
        $reponses = $repository->findByrepasc();

        return $this->render('reponse-back/index.html.twig', [
            'reponses' => $reponses,
        ]);
    }
    /**
     * @Route("/rep/Triedsc2", name="Triedsc2")
     */
    public function Triedsc2(Request $request): Response
    {
        $repository = $this->getDoctrine()->getRepository(Reponse::class);
        $reponses = $repository->findByrepdsc();

        return $this->render('reponse-back/index.html.twig', [
            'reponses' => $reponses,
        ]);
    }
/**
     * @Route("/rep/lis", name="listsrep")
     */
    public function liste(ReponseRepository $reponseRepository ,NormalizerInterface $Normalizer)
    {
     $liste=$reponseRepository->findAll();

      $jsonContent=$Normalizer->normalize($liste,'json',['groups'=>'post:read']);

      return new Response(json_encode($jsonContent));
    
     }
     /**
     * @Route("/pi/devrep", name="rep2_mob", methods={"GET", "POST"})
     */
    public function repaddmob(Request $request)
    {
    $reponse = new Reponse();

 $rep = $request->query->get("rep");

 $idrec= $request->query->get("idrec");
 $em = $this->getDoctrine()->getManager();
 $reclamation  = new Reclamation();

 $reclamation = $em->getRepository(Reclamation::class)->find($idrec);


 if($reclamation!=null){
 $reponse->setRep($rep);
 $reponse->setReclamation($reclamation);

 
 $em->persist($reponse);
 $em->flush();
 $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($reponse);
 return new JsonResponse($formatted);
 }}
/**
     * @Route("/sup/rep", name="reponse-supprimer", methods={"GET", "POST"})
     */
    public function supprimerrep(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $reponse = $em->getRepository(Reponse::class)->find($id);
        if($reponse!=null){
            $em->remove($reponse);
            $em->flush();
            $serializer = new Serializer([new ObjectNormalizer()]);
            $formatted =$serializer->normalize("Reponse supprimeé avec succes !!");
            return new JsonResponse($formatted);
        }
        return new JsonResponse("id reponse invalid !");
    }

/**
     * @Route("/mod/rep", name="reponse_modif", methods={"GET", "POST","PUT"})
     */
    public function modifrep(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $reponse = $em->getRepository(Reponse::class)->find($id);
        $reponse ->setRep($request->query->get("rep"));
       
        $em->persist($reponse);
         $em->flush();
      $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($reponse);
 return new JsonResponse("reponse modifiee avec succes ! ");

    }
/**
     * @Route("/rept/trieasc", name="reptria")
     */
    public function Reptri(Request $request ,ReponseRepository $reponseRepository ,NormalizerInterface $Normalizer)
    {
        $repository = $this->getDoctrine()->getRepository(Reponse::class);
        $recs = $repository-> findByrepasc();

    $jsonContent=$Normalizer->normalize($recs,'json',['groups'=>'post:read']);

        return new Response(json_encode($jsonContent));
      dump($json_content);
      die;
       
    }
    /**
     * @Route("/reptride/tridrep", name="reptrid")
     */
    public function Reptrid(Request $request ,ReponseRepository $reponseRepository ,NormalizerInterface $Normalizer)
    {
        $repository = $this->getDoctrine()->getRepository(Reponse::class);
        $reponse = $repository->findByrepdsc();

        $jsonContent=$Normalizer->normalize($reponse,'json',['groups'=>'post:read']);
      return new Response(json_encode($jsonContent));
       
    }

    }
    

