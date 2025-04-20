import { Button } from '@/components/ui/button';
import { useSendTransaction, useActiveAccount } from 'thirdweb/react';
import { marketplaceContract } from '@/lib/contracts';
import { prepareContractCall } from 'thirdweb';

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string | number | bigint;
  pricePerToken: string | number | bigint;
}

export const BuyModal = ({
  open,
  onClose,
  listingId,
  pricePerToken,
}: BuyModalProps) => {
  const account = useActiveAccount();
  const { mutate: buyNow, isPending: isBuying } = useSendTransaction();

  const handleBuy = () => {
    // Convierte todo a tipo bigint si hace falta
    const idParam =
      typeof listingId === 'bigint' ? listingId : BigInt(listingId);
    const priceParam =
      typeof pricePerToken === 'bigint' ? pricePerToken : BigInt(pricePerToken);

    const tx = prepareContractCall({
      contract: marketplaceContract,
      method:
        'function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice) payable',
      params: [
        idParam, // Listing ID (bigint)
        account?.address || '', // Comprador
        1n, // cantidad (1 por defecto)
        '0x0000000000000000000000000000000000000000', // POLYGON/MATIC native
        priceParam, // Precio esperado en wei (bigint)
      ],
    });
    buyNow(tx);
  };

  if (!open) return null;
  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.2)',
      }}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: 400,
          margin: '100px auto',
          background: 'white',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 10px 24px #0002',
        }}
      >
        <h2>Confirmar Compra</h2>
        <p>¿Deseas comprar esta propiedad?</p>
        <Button disabled={isBuying} onClick={handleBuy}>
          {isBuying ? 'Comprando...' : 'Confirmar compra'}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
