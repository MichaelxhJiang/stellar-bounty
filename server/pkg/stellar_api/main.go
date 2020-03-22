package stellar_api

import (
	"errors"
	"github.com/stellar/go/clients/horizonclient"
	"github.com/stellar/go/keypair"
	"github.com/stellar/go/network"
	"github.com/stellar/go/txnbuild"
	"log"
)

/*
sign and submit a transaction to the stellar network

src: secret key of sender
dest: public address of receiver
*/

func BigTestFunc() {}

func signAndSubmitTransaction(src, dest) {
	kp, _ := keypair.Parse(src)
	client := horizonclient.DefaultPublicNetClient

	// load account information
	accountRequest := horizonclient.AccountRequest{AccountID: kp.Address()}
	sourceAccount, err := client.AccountDetail(accountRequest)
	if err != nil {
		log.Fatal(err)
	}

	op := txnbuild.Payment{
		Destination: dest,
		Amount:      "1",
		Asset:       txnbuild.NativeAsset{},
	}

	tx := txnbuild.Transaction{
		SourceAccount: &sourceAccount,
		Operations:    []txnbuild.Operation{&op},
		Timebounds:    txnbuild.NewTimeout(300),
		Network:       network.PublicNetworkPassphrase,
	}

	txe, err := tx.BuildSignEncode(kp.(*keypair.Full))
	if err != nil {
		log.Fatal("Error signing transaction::", err)
	}
	log.Println("Transaction base64::" + txe)

	resp, err := client.SubmitTransactionXDR(txe)
	if err != nil {
		hError := err.(*horizonclient.Error)
		log.Fatal("Error submitting transaction::", hError)
	}

	log.Println("Transaction response::", resp)
}

/*
generate a transaction uri given arguments

dest: public address of receiver
amount: amount of asset
assetName: ISO format: XLM, USD, etc
memo: a string to store in memo
*/
func generateTransactionURI(dest, amount, assetName, memo string) (string, error) {
	/*
		Using SEP 7 Protocol
		Example format for native currency: web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.1234567&memo=skdjfasf&msg=pay%20me%20with%20lumens
		Example format for specific asset: web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.123&asset_code=USD&asset_issuer=GCRCUE2C5TBNIPYHMEP7NK5RWTT2WBSZ75CMARH7GDOHDDCQH3XANFOB&memo=hasysda987fs&callback=url%3Ahttps%3A%2F%2FsomeSigningService.com%2Fhasysda987fs%3Fasset%3DUSD
	*/
	var generatedUri = "web+stellar:pay?destination=" + dest + "&amount=" + amount
	switch assetName {
	case "XLM":
		generatedUri += "&memo=" + memo
	case "USD":
		assetCode := "USD"
		assetIssuer := "GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX"
		generatedUri += "&asset_code" + assetCode + "&asset_issuer=" + assetIssuer + "&memo=" + memo
	default:
		return "", errors.New("Unsupported asset name::" + assetName)
	}

	return generatedUri, nil
}
