package main

import (
	"log"
	"github.com/stellar/go/txnbuild"
	"github.com/stellar/go/network"
	"github.com/stellar/go/horizonclient"
	"github.com/stellar/go/keypair"
)

func main() {
	sourceAddress := "GDVFQQQOCPPQJZLFSABMPBAVKCHPE7KD7SN6CWBH4JEKPE4LVLYMNMYS"
	destinationAddress := "GDVFQQQOCPPQJZLFSABMPBAVKCHPE7KD7SN6CWBH4JEKPE4LVLYMNMYS"
	kp, _ := keypair.Parse(sourceAddress)
	client = horizonclient.DefaultPublicNetClient

	// load account information
	accountRequest = horizonclient.AccountRequest{AccountID: kp.Address()}
	sourceAccount, err := client.AccountDetail()
	if err != nil {
		log.Fatal(err)
	}
	
	op := Payment{
		Destination: destinationAddress,
		Amount: "1",
		Asset: NativeAsset{}
	}

	tx := Transaction{
		SourceAccount: &sourceAccount,
		Operations: []Operation{&op},
		Timebounds: txnbuild.NewTimeout(300),
		Network: network.PublicNetworkPassphrase
	}

	txe, err := tx.BuildSignEncode(kp.(*keypair.Full))
	log.Println("Transaction base64::" + txe)

	resp, err := client.SubmitTransactionXDR(txe)
	if err != nil {
		hError := err.(*horizontalclient.Error)
		log.Fatal("Error submitting transaction::", hError)
	}
}