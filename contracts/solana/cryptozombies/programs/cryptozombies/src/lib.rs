use anchor_lang::prelude::*;

declare_id!("BJ6fL2BsUqkRbqXEeQ4mQ6HLens4jYEqmwQg3yFkbSrF");

#[program]
pub mod cryptozombies {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        level_up_fee_lamports: u64,
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;

        global_state.admin = ctx.accounts.admin.key();
        global_state.level_up_fee_lamports = level_up_fee_lamports;
        global_state.next_zombie_id = 1;
        global_state.paused = false;
        global_state.bump = ctx.bumps.global_state;

        Ok(())
    }

    pub fn create_starter_zombie(
        ctx: Context<CreateStarterZombie>,
        name: String,
        dna: u64,
        rarity: u8,
    ) -> Result<()> {
        require!(name.len() <= ZombieAccount::MAX_NAME_LEN, ErrorCode::NameTooLong);

        let global_state = &mut ctx.accounts.global_state;
        let player_profile = &mut ctx.accounts.player_profile;
        let zombie = &mut ctx.accounts.zombie;

        require!(!player_profile.starter_created, ErrorCode::StarterAlreadyCreated);

        player_profile.owner = ctx.accounts.owner.key();
        player_profile.starter_created = true;
        player_profile.zombie_count = player_profile.zombie_count.checked_add(1).unwrap();
        player_profile.bump = ctx.bumps.player_profile;

        let zombie_id = global_state.next_zombie_id;
        global_state.next_zombie_id = global_state.next_zombie_id.checked_add(1).unwrap();

        zombie.id = zombie_id;
        zombie.owner = ctx.accounts.owner.key();
        zombie.dna = dna;
        zombie.rarity = rarity;
        zombie.level = 1;
        zombie.ready_time = Clock::get()?.unix_timestamp;
        zombie.win_count = 0;
        zombie.loss_count = 0;
        zombie.bump = ctx.bumps.zombie;
        zombie.set_name(&name)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        seeds = [GlobalState::SEED],
        bump,
        space = GlobalState::SPACE,
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateStarterZombie<'info> {
    #[account(
        mut,
        seeds = [GlobalState::SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        init_if_needed,
        payer = owner,
        seeds = [PlayerProfile::SEED, owner.key().as_ref()],
        bump,
        space = PlayerProfile::SPACE,
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(
        init,
        payer = owner,
        seeds = [ZombieAccount::SEED, owner.key().as_ref(), &global_state.next_zombie_id.to_le_bytes()],
        bump,
        space = ZombieAccount::SPACE,
    )]
    pub zombie: Account<'info, ZombieAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GlobalState {
    pub admin: Pubkey,
    pub level_up_fee_lamports: u64,
    pub next_zombie_id: u32,
    pub paused: bool,
    pub bump: u8,
    pub _reserved: [u8; 2],
}

impl GlobalState {
    pub const SEED: &'static [u8] = b"global-state";
    pub const SPACE: usize = 8 /* discriminator */
        + 32 /* admin */
        + 8 /* level_up_fee */
        + 4 /* next_zombie_id */
        + 1 /* paused */
        + 1 /* bump */
        + 2; /* reserved */
}

#[account]
pub struct PlayerProfile {
    pub owner: Pubkey,
    pub zombie_count: u16,
    pub starter_created: bool,
    pub bump: u8,
    pub _reserved: [u8; 4],
}

impl PlayerProfile {
    pub const SEED: &'static [u8] = b"player-profile";
    pub const SPACE: usize = 8 /* discriminator */
        + 32 /* owner */
        + 2 /* zombie_count */
        + 1 /* starter_created */
        + 1 /* bump */
        + 4; /* reserved */
}

#[account]
pub struct ZombieAccount {
    pub id: u32,
    pub owner: Pubkey,
    pub dna: u64,
    pub rarity: u8,
    pub level: u16,
    pub ready_time: i64,
    pub win_count: u16,
    pub loss_count: u16,
    pub bump: u8,
    pub name: [u8; ZombieAccount::MAX_NAME_LEN],
    pub name_len: u8,
}

impl ZombieAccount {
    pub const SEED: &'static [u8] = b"zombie";
    pub const MAX_NAME_LEN: usize = 32;
    pub const SPACE: usize = 8 /* discriminator */
        + 4 /* id */
        + 32 /* owner */
        + 8 /* dna */
        + 1 /* rarity */
        + 2 /* level */
        + 8 /* ready_time */
        + 2 /* win */
        + 2 /* loss */
        + 1 /* bump */
        + Self::MAX_NAME_LEN /* name */
        + 1; /* name_len */

    pub fn set_name(&mut self, name: &str) -> Result<()> {
        let bytes = name.as_bytes();
        require!(bytes.len() <= Self::MAX_NAME_LEN, ErrorCode::NameTooLong);
        self.name.fill(0);
        self.name[..bytes.len()].copy_from_slice(bytes);
        self.name_len = bytes.len() as u8;
        Ok(())
    }

    pub fn name(&self) -> String {
        let len = self.name_len as usize;
        String::from_utf8_lossy(&self.name[..len]).to_string()
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Zombie name exceeds max length")]
    NameTooLong,
    #[msg("Starter zombie already created")]
    StarterAlreadyCreated,
}
