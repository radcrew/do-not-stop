import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cryptozombies } from "../target/types/cryptozombies";

describe("cryptozombies", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cryptozombies as Program<Cryptozombies>;

  it("initializes global state", async () => {
    const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global-state")],
      program.programId,
    );

    const tx = await program.methods
      .initialize(new anchor.BN(1_000_000))
      .accounts({
        globalState,
      })
      .rpc();

    console.log("initialized tx", tx);
  });
});
