<?php

namespace App\Repository;

use App\Entity\Reclamation2;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Reclamation2|null find($id, $lockMode = null, $lockVersion = null)
 * @method Reclamation2|null findOneBy(array $criteria, array $orderBy = null)
 * @method Reclamation2[]    findAll()
 * @method Reclamation2[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class Reclamation2Repository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reclamation2::class);
    }

    // /**
    //  * @return Reclamation2[] Returns an array of Reclamation2 objects
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
    public function findOneBySomeField($value): ?Reclamation2
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
