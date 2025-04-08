<?php

namespace App\Controller;

use App\Entity\Reclamation;
use App\Form\ReclamationType;
use App\Repository\ReclamationRepository;
use App\Repository\CalenderRepository ;
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
 * @Route("/reclamation")
 */
class ReclamationController extends AbstractController
{
  
    /**
     * @Route("/", name="reclamation_index", methods={"GET"})
     */
    public function index(ReclamationRepository $reclamationRepository ): Response
    {
        
        return $this->render('reclamation/index.html.twig', [
            'reclamations' => $reclamationRepository->findAll()
        ]);
    }

    /**
     * @Route("/back", name="reclamation_index_back", methods={"GET"})
     */
    public function index2(ReclamationRepository $reclamationRepository): Response

    
{

    return $this->render('reclamation-back/index.html.twig', [
            'reclamations' => $reclamationRepository->findAll()
        ]);
    }

    /**
     * @Route("/new", name="reclamation_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $reclamation = new Reclamation();
       
        $form = $this->createForm(ReclamationType::class, $reclamation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($reclamation);
            $entityManager->flush();
            $this->addFlash('success', 'Reclamation Ajouter!');
            return $this->redirectToRoute('reclamation_index', [], Response::HTTP_SEE_OTHER);

        }

        return $this->render('reclamation/new.html.twig', [
            'reclamation' => $reclamation,
            'form' => $form->createView(),
        ]);
    }


 /**
     * @Route("/back/new", name="reclamation_new_back", methods={"GET", "POST"})
     */
    public function new2(Request $request, EntityManagerInterface $entityManager): Response
    {
        $reclamation = new Reclamation();
     
        $form = $this->createForm(ReclamationType::class, $reclamation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($reclamation);
            $entityManager->flush();
            $this->addFlash('success', 'Reclamation Ajouter!');
           
            
            return $this->redirectToRoute('reclamation_index_back', [], Response::HTTP_SEE_OTHER);
        }
        

        return $this->render('reclamation-back/new.html.twig', [
            'reclamation' => $reclamation,
            'form' => $form->createView(),
        ]);
    }




    /**
     * @Route("/{id}", name="reclamation_show", methods={"GET"})
     */
    public function show(Reclamation $reclamation): Response
    {
        return $this->render('reclamation/show.html.twig', [
            'reclamation' => $reclamation,
        ]);
    }


    
    /**
     * @Route("/back/{id}", name="reclamation_show_back", methods={"GET"})
     */
    public function show2(Reclamation $reclamation): Response
    {
        return $this->render('reclamation-back/show.html.twig', [
            'reclamation' => $reclamation,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="reclamation_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Reclamation $reclamation, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ReclamationType::class, $reclamation);
        
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            $this->addFlash('success', 'Reclamation Modifier!');

            return $this->redirectToRoute('reclamation_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reclamation/edit.html.twig', [
            'reclamation' => $reclamation,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/back/{id}/edit", name="reclamation_edit_back", methods={"GET", "POST"})
     */
    public function edit2(Request $request, Reclamation $reclamation, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ReclamationType::class, $reclamation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('reclamation_index_back', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('reclamation-back/edit.html.twig', [
            'reclamation' => $reclamation,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="reclamation_delete", methods={"POST"})
     */
    public function delete(Request $request, Reclamation $reclamation, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$reclamation->getId(), $request->request->get('_token'))) {
            $entityManager->remove($reclamation);
            $entityManager->flush();
        }
        $this->addFlash('success', 'Reclamation Supprimer!');

        return $this->redirectToRoute('reclamation_index', [], Response::HTTP_SEE_OTHER);
    }  
    /**
     * @Route("/back/{id}", name="reclamation_delete_back", methods={"POST"})
     */
    public function delete2(Request $request, Reclamation $reclamation, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$reclamation->getId(), $request->request->get('_token'))) {
            $entityManager->remove($reclamation);
            $entityManager->flush();
        }
        $this->addFlash('success', 'Reclamation Supprimer!');

        return $this->redirectToRoute('reclamation_index_back', [], Response::HTTP_SEE_OTHER);
    }
    


   /**
    * @Route("/recherche/search", name="ajax_search", methods={"GET"})
    */
   public function searchAction(Request $request) {
    $em = $this->getDoctrine()->getManager();

    $requestString = $request->get('q');

    $entities =  $em->getRepository(Reclamation::class)->findEntitiesByString2($requestString);
//dump($entities);
//die();
    if(!$entities) {
        $result['entities']['error'] = "0 reclamation";
    } else {
        $result['entities'] = $this->getRealEntities($entities);
    }

    return new Response(json_encode($result));
}

public function getRealEntities($entities){


    foreach ($entities as $entity){
        
$obj = $entity->getDater();
$dmy=$obj->format('d-m-Y');
$obj2 = $entity->getUsername();
$nom = $obj2->getNom();
 $realEntities[$entity->getId()]=[$nom,$entity->getMsg(),$entity->getType(),$dmy];
     
        

    return $realEntities;
}
}


/**
     * @Route("/calen/full", name="full", methods={"GET"})
     */
    public function full(CalenderRepository $CalenderRepository): Response
    {

        $events=$CalenderRepository->findAll();

        $rdvs = [];

        foreach($events as $event){
            $rdvs[] = [
                'id' => $event->getId(),
                'start' => $event->getStart()->format('Y-m-d H:i:s'),
                'end' => $event->getEnd()->format('Y-m-d H:i:s'),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'backgroundColor' => $event->getBackgroundcolor(),
                'borderColor' => $event->getBordercolor(),
                'textColor' => $event->getTextcolor(),
                'allDay' => $event->getAllDay(),
            ];
        }

        $data = json_encode($rdvs);


        return $this->render('reclamation/full.html.twig',compact('data'));
    }
     /**
    * @Route("/recherche/search2", name="ajax_search2", methods={"GET"})
    */
   public function searchAction2(Request $request) {
    $em = $this->getDoctrine()->getManager();

    $requestString = $request->get('q');

    $entities =  $em->getRepository(Reclamation::class)->findEntitiesByString2($requestString);
//dump($entities);
//die();
    if(!$entities) {
        $result['entities']['error'] = "0 reclamation";
    } else {
        $result['entities'] = $this->getRealEntities2($entities);
    }

    return new Response(json_encode($result));
}
public function getRealEntities2($entities){
    foreach ($entities as $entity){
$obj = $entity->getDater();
$dmy=$obj->format('d-m-Y');
$obj2 = $entity->getUsername();
$nom = $obj2->getNom();
$prenom = $obj2->getPrenom();
 //$realEntities[$entity->getId()]=[$nom,$entity->getMsg(),$entity->getType(),$dmy];
$realEntities[$entity->getId()]=[$entity->getId(),$nom,$prenom,
$entity->getMsg(),$entity->getType(),$dmy];

        

    return $realEntities;
}
}


/**
     * @Route("/calen/full2", name="fullback", methods={"GET"})
     */
    public function fullback(CalenderRepository $CalenderRepository): Response
    {

        $events=$CalenderRepository->findAll();

        $rdvs = [];

        foreach($events as $event){
            $rdvs[] = [
                'id' => $event->getId(),
                'start' => $event->getStart()->format('Y-m-d H:i:s'),
                'end' => $event->getEnd()->format('Y-m-d H:i:s'),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'backgroundColor' => $event->getBackgroundcolor(),
                'borderColor' => $event->getBordercolor(),
                'textColor' => $event->getTextcolor(),
                'allDay' => $event->getAllDay(),
            ];
        }

        $data = json_encode($rdvs);


        return $this->render('calender-back/full-back.html.twig',compact('data'));
    }

/**
     * @Route("/pi/dev", name="reclamation2_mob", methods={"GET", "POST"})
     */
    public function addmob(Request $request)
    {
    $reclamation = new Reclamation();

 $description = $request->query->get("msg");
 $type = $request->query->get("type"); 
 $dater = $request->query->get("dater"); 
 $em = $this->getDoctrine()->getManager();

 $reclamation->setMsg($description);
$reclamation->setType($type);
 $reclamation->setDater($dater);
 $em->persist($reclamation);
 $em->flush();
 $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($reclamation);
 return new JsonResponse($formatted);

    }
/**
     * @Route("/sup/js", name="reclamation-supprimer", methods={"GET", "POST"})
     */
    public function supprimer(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $reclamation = $em->getRepository(Reclamation::class)->find($id);
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
     * @Route("/mod/js", name="reclamation2_modif", methods={"GET", "POST","PUT"})
     */
    public function modif(Request $request)
    {
        $id= $request->get("id");
        $em = $this->getDoctrine()->getManager();
        $reclamation = $em->getRepository(Reclamation::class)->find($id);
        $reclamation->setMsg($request->query->get("msg"));
        $reclamation->setType($request->query->get("type"));
        $reclamation->setDater($request->query->get("dater"));
        $em->persist($reclamation);
         $em->flush();
      $serializer = new Serializer([new ObjectNormalizer()]);
 $formatted =$serializer->normalize($reclamation);
 return new JsonResponse("reclamation modifiee avec succes ! ");

    }
/**
     * @Route("/lis/js", name="lists")
     */
    public function liste(ReclamationRepository $reclamationRepository ,NormalizerInterface $Normalizer)
    {
     $liste=$reclamationRepository->findAll();
    
      $jsonContent=$Normalizer->normalize($liste,'json',['groups'=>'post:read']);

      return new Response(json_encode($jsonContent));
    //dump($json_content);
    //die;

    }
/**
     * @Route("/lis/recherche", name="listsrecherche")
     */
    public function listerecherche(Request $request ,ReclamationRepository $reclamationRepository ,NormalizerInterface $Normalizer)
    {
        $requestString = $request->get('q');
        $entities=$reclamationRepository->findEntitiesByString2($requestString);

      $jsonContent=$Normalizer->normalize($entities,'json',['groups'=>'post:read']);

      return new Response(json_encode($jsonContent));

        }
    public function RealEntities2($entities){
        foreach ($entities as $entity){
    $obj = $entity->getDater();

     //$realEntities[$entity->getId()]=[$nom,$entity->getMsg(),$entity->getType(),$dmy];
    $realEntities[$entity->getId()]=[$entity->getId(),
$entity->getMsg(),$entity->getType(),$obj];
        return $realEntities;
    }

}
 /**
     * @Route("/rec/trieasc", name="rectrieasc")
     */
    public function Rectrieasc(Request $request ,ReclamationRepository $reclamationRepository ,NormalizerInterface $Normalizer)
    {
        $repository = $this->getDoctrine()->getRepository(Reclamation::class);
        $recs = $repository-> findByrepasc();

    $jsonContent=$Normalizer->normalize($recs,'json',['groups'=>'post:read']);

        return new Response(json_encode($jsonContent));
      dump($json_content);
      die;
       
    }
    /**
     * @Route("/rec/triedesc", name="rectriedesc")
     */
    public function Rectriedesc(Request $request ,ReclamationRepository $reclamationRepository ,NormalizerInterface $Normalizer)
    {
        $repository = $this->getDoctrine()->getRepository(Reclamation::class);
        $reclamation = $repository->findByrepdsc();

        $jsonContent=$Normalizer->normalize($reclamation,'json',['groups'=>'post:read']);
      return new Response(json_encode($jsonContent));
       
    }





}