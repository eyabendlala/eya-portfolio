<?php

namespace App\Controller;

use App\Entity\Reclamation2;
use App\Form\Reclamation2Type;
use App\Repository\Reclamation2Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;



/**
 * @Route("/reclamation2")
 */
class Reclamation2Controller extends AbstractController
{
    /**
     * @Route("/", name="reclamation2_index", methods={"GET"})
     */
    public function index(Reclamation2Repository $reclamation2Repository): Response
    {
        return $this->render('reclamation2/index.html.twig', [
            'reclamation2s' => $reclamation2Repository->findAll(),
        ]);
    }
     /**
     * @Route("/liste", name="listes")
     */
    public function liste(Reclamation2Repository $reclamationRepository ,NormalizerInterface $Normalizer)
    {
     $liste=$reclamationRepository->findAll();
    
      $jsonContent=$Normalizer->normalize($liste,'json',['groups'=>'post:read']);

      return new Response(json_encode($jsonContent));
     //dump($json_content);
     //die;

    }
  /**
     * @Route("/addjson", name="addjson")
     */
    public function Addjson(Request $request, EntityManagerInterface $entityManager,NormalizerInterface $Normalizer)
    {
        $reclamation = new Reclamation2();
    $reclamation->setType($request->get("type"));
    $reclamation->setDescription($request->get("description"));
   
    $entityManager->persist($reclamation);
    $entityManager>flush();
    $jsonContent=$Normalizer->normalize($reclamation,'json',['groups'=>'post:read']);
    
    return new Response(json_encode($jsonContent));
    
    }
    /**
     * @Route("/new", name="reclamation2_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $reclamation2 = new Reclamation2();
        $form = $this->createForm(Reclamation2Type::class, $reclamation2);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($reclamation2);
            $entityManager->flush();

            return $this->redirectToRoute('reclamation2_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reclamation2/new.html.twig', [
            'reclamation2' => $reclamation2,
            'form' => $form->createView(),
        ]);
    }


/**
     * @Route("/addrec2", name="reclamation2_newj", methods={"GET", "POST"})
     */
    public function new2(Request $request)
    {
        $reclamation2 = new Reclamation2();
 $description = $request->query->get("description");
 $type = $request->query->get("type"); 
 $em = $this->getDoctrine()->getManager();
 $reclamation2->setDescription($description);
 $reclamation2->setType($type);
 $em->persist($reclamation2);
 $em->flush();
 $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($reclamation2);
 return new JsonResponse($formatted);

    }
/**
     * @Route("/supprimerrec", name="reclamation2_supprimer", methods={"GET", "POST"})
     */
    public function supprimer(Request $request)
    {


        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $reclamation = $em->getRepository(Reclamation2::class)->find($id);
        if($reclamation!=null){
            $em->remove($reclamation);
            $em->flush();
            $serializer = new Serializer([new ObjectNormalizer()]);
            $formatted =$serializer->normalize("reclamation supprimeé avec succes !!");
            return new JsonResponse($formatted);
        }
        return new JsonResponse("id reclamation invalid !");




    }

/**
     * @Route("/modj", name="reclamation2_modif", methods={"GET", "POST","PUT"})
     */
    public function modif(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $reclamation = $em->getRepository(Reclamation2::class)->find($id);
        $reclamation->setDescription($request->query->get("description"));
        $reclamation->setType($request->query->get("type"));
        $em->persist($reclamation);
         $em->flush();
      $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($reclamation);
 return new JsonResponse("reclamation modifiee avec succes ! ");

    }



    /**
     * @Route("/{id}", name="reclamation2_show", methods={"GET"})
     */
    public function show(Reclamation2 $reclamation2): Response
    {
        return $this->render('reclamation2/show.html.twig', [
            'reclamation2' => $reclamation2,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="reclamation2_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Reclamation2 $reclamation2, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(Reclamation2Type::class, $reclamation2);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('reclamation2_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reclamation2/edit.html.twig', [
            'reclamation2' => $reclamation2,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="reclamation2_delete", methods={"POST"})
     */
    public function delete(Request $request, Reclamation2 $reclamation2, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$reclamation2->getId(), $request->request->get('_token'))) {
            $entityManager->remove($reclamation2);
            $entityManager->flush();
        }

        return $this->redirectToRoute('reclamation2_index', [], Response::HTTP_SEE_OTHER);
    }
}
