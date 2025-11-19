pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::{
    create_starter_zombie::*,
    initialize::*,
    level_up::*,
};

declare_id!("BJ6fL2BsUqkRbqXEeQ4mQ6HLens4jYEqmwQg3yFkbSrF");

#[program]
pub mod cryptozombies {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        level_up_fee_lamports: u64,
    ) -> Result<()> {
        initialize::handler(ctx, level_up_fee_lamports)
    }

    pub fn create_starter_zombie(
        ctx: Context<CreateStarterZombie>,
        name: String,
        dna: u64,
        rarity: u8,
    ) -> Result<()> {
        create_starter_zombie::handler(ctx, name, dna, rarity)
    }

    pub fn level_up(ctx: Context<LevelUp>) -> Result<()> {
        level_up::handler(ctx)
    }
}
