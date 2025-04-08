<?php

namespace App\Repository;

use App\Entity\Reclamation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Reclamation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Reclamation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Reclamation[]    findAll()
 * @method Reclamation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReclamationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reclamation::class);
    }
    public function findEntitiesByString2($str){
        return $this->createQueryBuilder('r')
   ->where('r.msg LIKE :t OR r.dater LIKE :t  OR r.type LIKE :t OR r.id LIKE :t ' )
   ->setParameter('t', '%'.$str.'%') 
   ->getQuery()
   ->getResult();
    }
    public function findByrepasc()
    {
        return $this->createQueryBuilder('reclamation')
            ->orderBy(' reclamation.msg','ASC')
            ->getQuery()
            ->getResult()
            ;
    }
    public function findByrepdsc()
    {
        return $this->createQueryBuilder('reclamation')
            ->orderBy('reclamation.msg','DESC')
            ->getQuery()
            ->getResult()
            ;
    }




    }
    
   
    // /**
    //  * @return Reclamation[] Returns an array of Reclamation objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Reclamation
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    

