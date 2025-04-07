<?php

namespace App\Controller;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;
use App\Entity\Finance;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use App\Form\FinanceType;
use App\Repository\DonsRepository;
use App\Repository\EvenementRepository;
use App\Repository\CommandeRepository;
use App\Repository\FinanceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Dompdf\Dompdf;
use Dompdf\Options;


/**
 * @Route("/finance")
 */
class FinanceController extends AbstractController
{
    /**
     * @Route("/", name="finance_index", methods={"GET"})
     */
    public function index(FinanceRepository $financeRepository): Response
    {
        return $this->render('finance/index.html.twig', [
            'finances' => $financeRepository->findAll(),
        ]);
    }
     /**
     * @Route("/liste", name="finance_liste", methods={"GET"})
     */
    public function liste(FinanceRepository $financeRepository): Response
    {
// Configure Dompdf according to your needs
$pdfOptions = new Options();
$pdfOptions->set('defaultFont', 'Arial');

// Instantiate Dompdf with our options
$dompdf = new Dompdf($pdfOptions);


// Retrieve the HTML generated in our twig file
$html = $this->renderView('finance/listef.html.twig', [
    'finances' => $financeRepository->findAll(),
]);

// Load HTML to Dompdf
$dompdf->loadHtml($html);

// (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
$dompdf->setPaper('A4', 'portrait');

// Render the HTML as PDF
$dompdf->render();

// Output the generated PDF to Browser (force download)
$dompdf->stream("mypdf.pdf", [
    "Attachment" => false
]);
       
    }

    /**
     * @Route("/new", name="finance_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager ): Response
    {
      
       
        $finance = new Finance();
        //$x=$d->getMontant()+ $c->getTotal()+ $e->getBillet();
     
       // $finance->setSomme($x);
       
        $form = $this->createForm(FinanceType::class, $finance);
       
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($finance);
            $entityManager->flush();
            $this->addFlash('success', 'Bilan Ajouter!');
            return $this->redirectToRoute('finance_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('finance/new.html.twig', [
            'finance' => $finance,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="finance_show", methods={"GET"})
     */
    public function show(Finance $finance): Response
    {
        return $this->render('finance/show.html.twig', [
            'finance' => $finance,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="finance_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Finance $finance, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(FinanceType::class, $finance);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            $this->addFlash('success', 'bilan Modifier!');

            return $this->redirectToRoute('finance_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('finance/edit.html.twig', [
            'finance' => $finance,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="finance_delete", methods={"POST"})
     */
    public function delete(Request $request, Finance $finance, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$finance->getId(), $request->request->get('_token'))) {
            $entityManager->remove($finance);
            $entityManager->flush();
            $this->addFlash('success', 'Bilan Supprimer!');
        }

        return $this->redirectToRoute('finance_index', [], Response::HTTP_SEE_OTHER);
    }
/**
     * @Route("/finance/stat", name="stat")
     */
    public function stat(FinanceRepository $financeRepository, DonsRepository $DonsRepository, 
    CommandeRepository $CommandeRepository, EvenementRepository $EvenementRepository)
    {
        $encoders = array(new XmlEncoder(), new JsonEncoder());
$normalizers = array(new GetSetMethodNormalizer());

$serializer = new Serializer($normalizers, $encoders);
$aff = $financeRepository->findAll();
        $categories = $financeRepository->findAll();
        foreach($categories as $categorie){
            $color1=$categorie->getColor1();
            $color2=$categorie->getColor2();
            $color3=$categorie->getColor3(); 
            $nom=$categorie->getDate();              
        }
        $test = array('data' => array($color1,$color3,$color2));
        //$arr = array('color1' => $color1, 'color2' => $color2, 'color3' => $color3);
        //echo json_encode($test);
        
        $test2 = array('data' => array($nom));
        $Dons = $DonsRepository->findAll();
        foreach($Dons as $don){
            $tottaled=$don->getMontant();
        }
        $coms = $CommandeRepository->findAll();
        foreach($coms as $com){
            $tottalec=$com->getTotal();
        }
        $events = $EvenementRepository->findAll();
        foreach($events as $ev){
            $tottalee=$ev->getBillet();
        }

        $prix = array('data' => array($tottaled,$tottalec,$tottalee));

        return $this->render('finance/stat.html.twig',[
            'tab' => $test,
            'affiche' => $aff,
            'prix'=> $prix,
      
          

        ]);
    }

    }
        
        
      

    

