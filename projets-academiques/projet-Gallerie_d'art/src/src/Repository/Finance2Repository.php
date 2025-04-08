<?php

namespace App\Repository;

use App\Entity\Finance2;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Finance2|null find($id, $lockMode = null, $lockVersion = null)
 * @method Finance2|null findOneBy(array $criteria, array $orderBy = null)
 * @method Finance2[]    findAll()
 * @method Finance2[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class Finance2Repository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Finance2::class);
    }

    // /**
    //  * @return Finance2[] Returns an array of Finance2 objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Finance2
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
