<?php

namespace App\Repository;

use App\Entity\Emplois;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Emplois|null find($id, $lockMode = null, $lockVersion = null)
 * @method Emplois|null findOneBy(array $criteria, array $orderBy = null)
 * @method Emplois[]    findAll()
 * @method Emplois[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EmploisRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Emplois::class);
    }

     /**
      * @return Emplois[] Returns an array of Emplois objects
      */
    
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->orWhere('e.id LIKE :val')
            ->orWhere('e.Dfin LIKE :val')
            ->orWhere('e.Ddebut LIKE :val')
            ->orWhere('e.Prenom LIKE :val')
            ->orWhere('e.Nom LIKE :val')
            ->orWhere('e.CIN LIKE :val')
            ->setParameter('val', '%'.$value.'%')
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult()
        ;
    }
    

    /*
    public function findOneBySomeField($value): ?Emplois
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
