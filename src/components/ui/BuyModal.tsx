'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSendTransaction, useActiveAccount } from 'thirdweb/react';
import { marketplaceContract } from '@/lib/contracts';

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
}

export const BuyModal = ({ open, onClose, listingId }: BuyModalProps) => {
  const account = useActiveAccount();
  const { mutate: buyNow, isPending: isBuying } = useSendTransaction();

  const handleBuy = () => {
    buyNow({
      contract: marketplaceContract,
      method: 'buyFromListing',
      params: {
        listingId,
        quantity: 1,
        receiver: account?.address || '',
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>¿Deseas comprar esta propiedad?</p>
          <Button disabled={isBuying} onClick={handleBuy}>
            {isBuying ? 'Comprando...' : 'Confirmar compra'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
