<?php

namespace App\Controller;

use App\Entity\Visite;
use App\Form\VisiteType;
use App\Repository\VisiteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Validator\Constraints\DateTime;
use Dompdf\Dompdf;
use Dompdf\Options;



/**
 * @Route("/visite")
 */
class VisiteController extends AbstractController
{
    /**
     * @Route("/index", name="visite_index")
     */
    public function index(Request $request, VisiteRepository $visiteRepository, PaginatorInterface $paginator)
    {
        $visiteRepository=$this->getDoctrine()->getRepository(Visite::class);
        $visites = $paginator->paginate(
            $visites=$visiteRepository->findAll(), // Requête contenant les données à paginer (ici nos articles)
            $request->query->getInt('page', 1), // Numéro de la page en cours, passé dans l'URL, 1 si aucune page
            3 // Nombre de résultats par page
        );
        return $this->render('visite/index.html.twig',[
            'visites'=>$visites
        ]);
    }
    /**
     * @Route("/afficher", name="afficher")
     */
    public function afficher1(NormalizerInterface $Normalizer)
    {
        $visite = $this->getDoctrine()
            ->getRepository(Visite::class)// on a récupéré le repository de l 'entity classroom
            ->findAll();// find all correspond à select *
        //$donnees=$this->getDoctrine()->getRepository(ReponseReclamation::class)->findBy(['description'=>'desc']);
        $jsonContent = $Normalizer->normalize($visite,'json',['groups'=>'post:read']);
        return new Response(json_encode($jsonContent));
        
    }
   
      
    /**
     * @Route("/recherche", name="Recherche")
     */

    public function Recherche(VisiteRepository $visiterepository,Request $request){
        $data=$request->get('search');
        $visite=$visiterepository->findBy(['description'=>$data]);
        return $this->render('visite/index1.html.twig', [
            'visites' => $visite,
        ]);

    }
    /**
     * @Route("/lis/recherche", name="listsrecherche")
     */
    public function listerecherche(Request $request ,VisiteRepository $visiteRepository ,NormalizerInterface $Normalizer)
    {
        $requestString = $request->get('q');
        $entities=$visiteRepository->findEntitiesByString2($requestString);
      $jsonContent=$Normalizer->normalize($entities,'json',['groups'=>'post:read']);
      return new Response(json_encode($jsonContent));

        }
    /**
     * @Route("/index1", name="visite_index1", methods={"GET"})
     */
    public function index1(VisiteRepository $visiteRepository): Response
    {
        return $this->render('visite/index1.html.twig', [
            'visites' => $visiteRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="visite_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $visite = new Visite();
        $form = $this->createForm(VisiteType::class, $visite);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($visite);
            $entityManager->flush();

            $this->addFlash('message', 'Added successfully !');


            return $this->redirectToRoute('visite_new', [], Response::HTTP_SEE_OTHER);
        }
        return $this->render('visite/new.html.twig', [
            'visite' => $visite,
            'form' => $form->createView(),
        ]);
    }
    /**
     * @Route("/addVisite", name="addVisite")
     */
    public function AddVisite(Request $request, NormalizerInterface $Normalizer )
    {
    
    $em=$this->getDoctrine()->getManager();
   $visite=new Visite();
   $visite->setDate($request->get("Date"));
   $visite->setDescription( $request->get("Description"));
   $visite->setNumCarte($request->get("num_carte"));
   $visite->setMontant($request->get("Montant"));
   $visite->setSexe($request->get("Sexe"));
   
   
    $em->persist($visite);
    $em->flush();
    $jsonContent=$Normalizer->normalize($visite,'json',['groups'=>'post:read']);
    
    return new Response(json_encode($jsonContent));
    
    }
     /**
     * @Route("/listv", name="visite_list", methods={"GET"})
     */
    public function listv(VisiteRepository $visiteRepository): Response
    {
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'Arial');
        
        // Instantiate Dompdf with our options
        $dompdf = new Dompdf($pdfOptions);
        $visite = $visiteRepository->findAll();
        
        // Retrieve the HTML generated in our twig file
        $html = $this->renderView('visite/listv.html.twig', [
            'visites' => $visite,
        ]);
        
       // Load HTML to Dompdf
       $dompdf->loadHtml($html);
        
       // (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
       $dompdf->setPaper('A4', 'portrait');

       // Render the HTML as PDF
       $dompdf->render();

       // Output the generated PDF to Browser (inline view)
       $dompdf->stream("mypdf.pdf", [
           "Attachment" => false
       ]);
   }

    /**
     * @Route("/{id}", name="visite_show", methods={"GET"})
     */
    public function show(Visite $visite): Response
    {
        return $this->render('visite/show.html.twig', [
            'visite' => $visite,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="visite_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Visite $visite, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(VisiteType::class, $visite);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            
            return $this->redirectToRoute('visite_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('visite/edit.html.twig', [
            'visite' => $visite,
            'form' => $form->createView(),
        ]);
    }
    /**
     * @Route("/updateVisite/{id}", name="updateVisite")
     */
    public function UpdateVisite(Request $request, NormalizerInterface $Normalizer,$id)
    {
    
        $em=$this->getDoctrine()->getManager();
        $visite= $em->getRepository(visite::class)->find($id);
   
    $visite->setDate($request->get("Date"));
   $visite->setDescription( $request->get("Description"));
   $visite->setNumCarte($request->get("num_carte"));
   $visite->setMontant($request->get("Montant"));
   $visite->setSexe($request->get("Sexe"));
    $em->flush();
    $jsonContent=$Normalizer->normalize($visite,'json',['groups'=>'post:read']);
    
    return new Response("visite modifiée avec succès".json_encode($jsonContent));;
    
    }
    

    /**
     * @Route("/{id}", name="visite_delete", methods={"POST"})
     */
    public function delete(Request $request, Visite $visite, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$visite->getId(), $request->request->get('_token'))) {
            $entityManager->remove($visite);
            $entityManager->flush();
        }

        return $this->redirectToRoute('visite_index', [], Response::HTTP_SEE_OTHER);
    }
     /**
     * @Route("/deleteV/{id}", name="deleteV")
     */
    public function deleteV(Request $request,NormalizerInterface $Normalizer,$id)
    {
        $em = $this->getDoctrine()->getManager();// l'appel à l'entity manager

        $obj = $em
            ->getRepository(Visite::class) //get doctrine : faire appel au doctrine
            ->find($id);// récupérer l'objet dont le id est donnée en parametre par la méthode find($id)
        $em->remove($obj);
        $em->flush();
 
  $jsonContent = $Normalizer->normalize($obj,'json',['groups'=>'post:read']);
        return new Response("visite supprimée avec succes".json_encode($jsonContent));
    }
   

    
}
