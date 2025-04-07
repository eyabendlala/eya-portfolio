<?php

namespace App\Controller;

use App\Entity\Dons;
use App\Form\DonsType;
use App\Repository\DonsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Validator\Constraints\DateTime;
use Dompdf\Dompdf;
use Dompdf\Options;


	  
class DonsController extends AbstractController
{
    /**
     * @Route("/index", name="dons_index", methods={"GET"})
     */
    public function index(DonsRepository $donsRepository): Response
    {
        return $this->render('dons/index.html.twig', [
            'dons' => $donsRepository->findAll(),
        ]);
    }
    /**
     * @Route("/afficher2", name="afficher2")
     */
    public function afficher2(NormalizerInterface $Normalizer)
    {
        $dons = $this->getDoctrine()
            ->getRepository(Dons::class)// on a récupéré le repository de l 'entity classroom
            ->findAll();// find all correspond à select *
        //$donnees=$this->getDoctrine()->getRepository(ReponseReclamation::class)->findBy(['description'=>'desc']);
        $jsonContent = $Normalizer->normalize($dons,'json',['groups'=>'post:read']);
        return new Response(json_encode($jsonContent));
    }
    /**
     * @Route("/tri", name="tri", methods={"GET"})
     */
    public function tri(DonsRepository $donsRepository): Response
    {
        $dons = $donsRepository->findByResultam();

        return $this->render('dons/index1.html.twig', [
            'dons' => $dons,
        ]);
    }
    /**
     * @Route("/tri1", name="tri1", methods={"GET"})
     */
    public function tri1(DonsRepository $donsRepository): Response
    {
        $dons = $donsRepository->findByResultam1();

        return $this->render('dons/index1.html.twig', [
            'dons' => $dons,
        ]);
    }
    /**
     * @Route("/recherche2", name="Recherche2")
     */

    public function Recherche2(DonsRepository $donsrepository,Request $request){
        $data=$request->get('search');
        $dons=$donsrepository->findBy(['num_carte'=>$data]);
        return $this->render('dons/index1.html.twig', [
            'dons' => $dons,
        ]);

    }
    
  
     /**
     * @Route("/index1", name="dons_index1", methods={"GET"})
     */
    public function index1(DonsRepository $donsRepository): Response
    {
        return $this->render('dons/index1.html.twig', [
            'dons' => $donsRepository->findAll(),
        ]);
    }
    /**
     * @Route("/listd", name="dons_list", methods={"GET"})
     */
    public function listd(DonsRepository $donsRepository): Response
    {
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'Arial');
        
        // Instantiate Dompdf with our options
        $dompdf = new Dompdf($pdfOptions);
        $dons = $donsRepository->findAll();
        
        // Retrieve the HTML generated in our twig file
        $html = $this->renderView('dons/listd.html.twig', [
            'dons' => $dons,
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
     * @Route("/new", name="dons_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $don = new Dons();
        $form = $this->createForm(DonsType::class, $don);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($don);
            $entityManager->flush();

            return $this->redirectToRoute('dons_new', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dons/new.html.twig', [
            'don' => $don,
            'form' => $form->createView(),
        ]);
    }
    /**
     * @Route("/addDons", name="addDons")
     */
    public function AddDons(Request $request, NormalizerInterface $Normalizer )
    {
    
    $em=$this->getDoctrine()->getManager();
    $dons=new Dons();
   
    $dons->setNumCarte($request->get("num_carte"));
    $dons->setMontant($request->get("montant"));
   
    $em->persist($dons);
    $em->flush();
    $jsonContent=$Normalizer->normalize($dons,'json',['groups'=>'post:read']);
    
    return new Response(json_encode($jsonContent));
    
    }
    /**
     * @Route("/updateDons/{id}", name="updateDons")
     */
    public function UpdateDons(Request $request, NormalizerInterface $Normalizer,$id)
    {
    
    $em=$this->getDoctrine()->getManager();
    $dons= $em->getRepository(Dons::class)->find($id);

   $dons->setNumCarte($request->get("num_carte"));
   $dons->setMontant($request->get("montant"));
    $em->flush();
    $jsonContent=$Normalizer->normalize($dons,'json',['groups'=>'post:read']);
    
    return new Response("don modifié avec succès".json_encode($jsonContent));
    
    }
    /**
     * @Route("/dons/{id}", name="dons_show", methods={"GET"})
     */
    public function show(Dons $don): Response
    {
        return $this->render('dons/show.html.twig', [
            'don' => $don,
        ]);
    }
    /**
     * @Route("/deleteD/{id}", name="deleteD")
     */
    public function deleteD(Request $request,NormalizerInterface $Normalizer,$id)
    {
        $em = $this->getDoctrine()->getManager();// l'appel à l'entity manager

        $obj = $em
            ->getRepository(Dons::class) //get doctrine : faire appel au doctrine
            ->find($id);// récupérer l'objet dont le id est donnée en parametre par la méthode find($id)
        $em->remove($obj);
        $em->flush();
 
  $jsonContent = $Normalizer->normalize($obj,'json',['groups'=>'post:read']);
        return new Response("don supprimé avec succes".json_encode($jsonContent));
    }
     
}