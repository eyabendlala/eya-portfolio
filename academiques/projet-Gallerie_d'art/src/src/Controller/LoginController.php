<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Form\LoginType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;


class LoginController extends AbstractController
{
    /**
     * @Route("/login", name="login")
     */
    public function index(): Response
    {
        return $this->render('front.office.html.twig', [
            'controller_name' => 'LoginController',
        ]);
    }
    /**
     * @Route("/login1", name="login1", methods={"GET", "POST"})
     */
    public function login(Request $request): Response
    {
        $user1 = new User();
        $user = new User();
        $form = $this->createForm(LoginType::class);
        $form ->remove("Prenom");
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user1 = $form->getData();
           // $entityManager = $this->getDoctrine()->getManager();
            //$user->setimage($fileName);
            //$entityManager->persist($user);
            //$entityManager->flush();
           // for ($x = 0; $x <= 10; $x++) {
             //   if($user{$x}->getNom()=='4848')
               
            // if($user1->getCIN()==12345678)
            $repository = $this->getdoctrine()->getRepository(User::class);
            $user = $repository->findOneBy(array('CIN' => $user1->getCIN(),'Password'=>$user1->getPassword()));

            if (!$user) {
                throw $this->createNotFoundException(
                    'No product found for id '
                );
            }else
            {{
                if($user->getRole()=='Admin'){
                    return
                    $this->redirect('http://127.0.0.1:8000/user/');}
                if($user->getRole()=='Membre'){
                    return
                    $this->redirect('http://127.0.0.1:8000/user/front/' .$user->getid());}}
              }
        /*  if($user1->getCIN()==12345678){
            return
            http://127.0.0.1:8000/user/newfront/
            $this->redirect('http://127.0.0.1:8000/user/newfront/');}
            if($user1->getCIN()==12345789){
                return
                $this->redirect('http://127.0.0.1:8000/user/');}*/
        }

        return $this->render('login.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }
}
