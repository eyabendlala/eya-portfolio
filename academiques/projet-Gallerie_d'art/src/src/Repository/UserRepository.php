<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

     /**
      * @return User[] Returns an array of User objects
     */
    
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.id LIKE :val')
            ->orWhere('u.Nom LIKE :val')
            ->orWhere('u.Prenom LIKE :val')
            ->orWhere('u.CIN LIKE :val')
            ->orWhere('u.Access LIKE :val')
            ->orWhere('u.Role LIKE :val')
            ->orWhere('u.datenaissance LIKE :val')
            ->setParameter('val', '%'.$value.'%')
            ->setMaxResults(20)

            ->orderBy('u.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
    public function findByEx($value)
    {
        return $this->createQueryBuilder('u')
     
            

            ->orderBy($value , 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }
    public function findByEx2($value)
    {
        return $this->createQueryBuilder('u')
     
            

            ->orderBy($value , 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
    

    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
